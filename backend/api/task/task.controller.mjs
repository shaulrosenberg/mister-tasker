import { taskService } from './task.service.mjs'
import { logger } from '../../services/logger.service.mjs'

let isWorkerOn = false

export async function getTasks(req, res) {
	try {
		logger.debug('Getting Tasks:', req.query)
		const { filterBy } = req.query
		const tasks = await taskService.query(filterBy)
		res.json(tasks)
	} catch (err) {
		logger.error('Failed to get tasks', err)
		res.status(400).send({ err: 'Failed to get tasks' })
	}
}

export async function getTaskById(req, res) {
	try {
		const taskId = req.params.id
		const task = await taskService.getById(taskId)
		res.json(task)
	} catch (err) {
		logger.error('Failed to get task', err)
		res.status(400).send({ err: 'Failed to get task' })
	}
}

export async function onPerformTask(req, res) {
	try {
		const task = req.body
		const updatedTask = await taskService.performTask(task)
		res.json(updatedTask)
	} catch (err) {
		logger.error('Failed to perform task', err)
		res.status(400).send({ err: 'Failed to perform task' })
	}
}

export async function runWorker(req, res) {
	// The isWorkerOn is toggled by the button: "Start/Stop Task Worker"
	isWorkerOn  = req.body.isWorkerOn

	if (!isWorkerOn) return
	var delay = 5000
	try {
		const task = await taskService.getNextTask()
		// extra check && task.status !== 'done' but already took care of this in query
		if (task) {
			try {
				await taskService.performTask(task)
			} catch (err) {
				console.log(`Failed Task`, err)
			} finally {
				delay = 1
			}
		} else {
			console.log('Snoozing... no tasks to perform')
		}
	} catch (err) {
		console.log(`Failed getting next task to execute`, err)
	} finally {
		setTimeout(() => runWorker(req, res), delay)
	}
}

export async function addTask(req, res) {
	// add logged in user for createdBy
	try {
		const task = req.body
		const addedTask = await taskService.add(task)
		res.json(addedTask)
	} catch (err) {
		logger.error('Failed to add task', err)
		res.status(400).send({ err: 'Failed to add task' })
	}
}


export async function updateTask(req, res) {
	try {
		const task = req.body
		const updatedTask = await taskService.update(task)
		res.json(updatedTask)
	} catch (err) {
		logger.error('Failed to update task', err)
		res.status(400).send({ err: 'Failed to update task' })

	}
}

export async function removeTask(req, res) {
	try {
		const taskId = req.params.id
		const removedId = await taskService.remove(taskId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove task', err)
		res.status(400).send({ err: 'Failed to remove task' })
	}
}


