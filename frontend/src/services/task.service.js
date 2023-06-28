import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { socketService } from './socket.service.js'

const BASE_URL = 'task/'

export const taskService = {
    query,
    getById,
    save,
    remove,
    runTask,
    runWorker
}


function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}

function getById(taskId) {
    return httpService.get(BASE_URL + taskId)
}

function remove(taskId) {
    return httpService.delete(BASE_URL + taskId)
}

async function save(task) {
    try {
        let updatedTask
        if (task._id) {
            updatedTask = await httpService.put(BASE_URL + task._id, task)
        } else {
            updatedTask = await httpService.post(BASE_URL, task)
        }
        // socketService.emit('task-change', updatedTask)
        return updatedTask
    } catch (err) {
        console.error('Failed to save task:', err)
        throw err
    }
}

async function runTask(task) {
    try {
        let updatedTask = await httpService.post(BASE_URL + task._id + '/start', task)
        return updatedTask
    } catch (err) {
        console.error('failed to run task', err)
        throw err
    }
}

async function runWorker(isWorkerOn) {
    try {
        await httpService.post(BASE_URL + 'worker/start', { isWorkerOn })
    } catch (err) {
        console.error('failed to run task worker', err)
        throw err
    }
}