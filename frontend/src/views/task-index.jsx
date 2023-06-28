import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { loadTasks, addTask, removeTask } from "../store/task.actions"
import { socketService } from "../services/socket.service"
// cmps
import { TaskControls } from "../cmps/task-controls"
import { TaskList } from "../cmps/task-list"
import { TaskFilter } from "../cmps/task-filter"

export function TaskIndex() {
    const { tasks } = useSelector(storeState => storeState.taskModule)
    const [filterBy, setFilterBy] = useState({ txt: '' })

    useEffect(() => {
        try {
            loadTasks()
            // add listeners for task-update / task-add
            socketService.on('task-updated', loadTasks)
        } catch (error) {
            console.log('Failed to load tasks:', error)
        }
        return () => {
            // remove listeners
            socketService.off('task-updated')
        }
    }, [])

    if (!tasks) return <h2>Loading...</h2>

    const filteredTasks = tasks.filter(task => {
        const filterRegEx = new RegExp(filterBy.txt, 'i')
        return !filterBy.txt || filterRegEx.test(task.title) || filterRegEx.test(task.description)
    })

    return (
        <section className="task-index">
            <h2>Mister Tasker</h2>
            <TaskControls />
            <TaskFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />
            <TaskList tasks={filteredTasks} onDeleteTask={removeTask} onAddTask={addTask} />
        </section>
    )
}