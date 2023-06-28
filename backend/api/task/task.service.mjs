import { dbService } from '../../services/db.service.mjs'
import { socketService } from '../../services/socket.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import mongodb from 'mongodb'
import { execute } from './external.service.mjs'
const { ObjectId } = mongodb

const PAGE_SIZE = 3


async function query(filterBy = {}) {
    try {
        // Default criteria if no filter is applied
        let criteria = { title: { $regex: '', $options: 'i' } }

        if (filterBy.txt) {
            // Apply text filter if provided
            criteria.title = { $regex: filterBy.txt, $options: 'i' }
        }

        // If there are additional filters, merge them with the criteria
        criteria = { ...criteria, ...filterBy }

        const collection = await dbService.getCollection('task')

        // Use the criteria here in find(criteria)
        var taskCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            taskCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const tasks = await taskCursor.toArray()
        return tasks
    } catch (err) {
        logger.error('cannot find tasks', err)
        throw err
    }
}



async function getById(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        const task = collection.findOne({ _id: new ObjectId(taskId) })
        return task
    } catch (err) {
        logger.error(`while finding task ${taskId}`, err)
        throw err
    }
}

async function remove(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(taskId) })
        return taskId
    } catch (err) {
        logger.error(`cannot remove task ${taskId}`, err)
        throw err
    }
}

async function add(task) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.insertOne(task)
        return task
    } catch (err) {
        logger.error('cannot insert task', err)
        throw err
    }
}

async function update(task) {
    try {
        const taskToSave = { ...task }
        // to avoid MongoError: modifying immutable field '_id'
        delete taskToSave._id
        // taskToSave
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: ObjectId(task._id) }, { $set: taskToSave })
        // emit task-updated
        socketService.emitTo({ type: 'task-updated', data: task })
        return task
    } catch (err) {
        logger.error(`cannot update task ${task._id}`, err)
        throw err
    }
}

async function performTask(task) {
    try {
        // Update task status to running and save to DB
        task.status = 'running'
        await update(task)

        // Execute the task using externalService.execute
        await execute(task)

        // Update task for success (doneAt, status)
        task.doneAt = new Date()
        task.status = 'done'
        await update(task)
    } catch (error) {
        // Update task for error: status, errors
        task.status = 'failed'
        task.errors?.push(error.message)
        await update(task)
    } finally {
        // Update task lastTried, triesCount and save to DB
        task.lastTriedAt = new Date()
        task.triesCount += 1
        await update(task)
    }
}

async function getNextTask() {
    try {
        // Get collection
        const collection = await dbService.getCollection('task')

        // prevent starvation, don't try to run failed or done tasks :)
        const tasks = await collection.find({
            status: { '$nin': ['failed', 'done'] },
            triesCount: { '$lt': 5 }
        }).toArray()

        if (tasks && tasks.length) {
            // sort the tasks by importance and triesCount
            tasks.sort((a, b) => {
                if (a.importance === b.importance) {
                    return a.triesCount - b.triesCount
                } else {
                    return b.importance - a.importance
                }
            })
            return tasks[0]
        }
    } catch (err) {
        console.error('Failed to get next task', err)
        throw err
    }
}




export const taskService = {
    remove,
    query,
    getById,
    add,
    update,
    getNextTask,
    performTask
}
