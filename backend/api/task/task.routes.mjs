import express from 'express'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getTasks, getTaskById, addTask, updateTask, removeTask, onPerformTask, runWorker } from './task.controller.mjs'


const router = express.Router()

// We can add a middleware for the entire router:
router.post('/worker/start', runWorker)
router.get('/', log, getTasks)
router.get('/:id', getTaskById)
// new route to run a specific task
router.post('/:id/start', onPerformTask)
// mutations
router.post('/',  addTask)
router.put('/:id',  updateTask)
router.delete('/:id',  removeTask)

export const taskRoutes = router
