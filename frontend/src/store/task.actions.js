import { taskService } from '../services/task.service.js'
import { store } from './store.js'

import {
  ADD_TASK,
  REMOVE_TASK,
  SET_TASKS,
  UNDO_REMOVE_TASK,
  UPDATE_TASK,

} from './task.reducer.js'


// Action Creators:
export function getActionRemoveTask(taskId) {
  return {
    type: REMOVE_TASK,
    taskId,
  }
}

export function getActionAddTask(task) {
  return {
    type: ADD_TASK,
    task,
  }
}
export function getActionUpdateTask(task) {
  return {
    type: UPDATE_TASK,
    task,
  }
}

export async function loadTasks(filterBy) {
  try {
    const tasks = await taskService.query(filterBy)
    console.log('Tasks from DB:', tasks)
    store.dispatch({
      type: SET_TASKS,
      tasks,
    })
  } catch (err) {
    console.log('Cannot load tasks', err)
    throw err
  }
}

export async function removeTask(taskId) {
  try {
    await taskService.remove(taskId)
    store.dispatch(getActionRemoveTask(taskId))
  } catch (err) {
    console.log('Cannot remove task', err)
    throw err
  }
}

export async function addTask(task) {
  try {
    const savedTask = await taskService.save(task)
    console.log('Added Task', savedTask)
    store.dispatch(getActionAddTask(savedTask))
    return savedTask
  } catch (err) {
    console.log('Cannot add task', err)
    throw err
  }
}


export async function runTask(taskId) {
  try {
    const updatedTask = await taskService.runTask(taskId)
    console.log('Task started', updatedTask)
    store.dispatch(getActionUpdateTask(updatedTask))
    return updatedTask
  } catch (err) {
    console.log('Cannot start task', err)
    throw err
  }
}
