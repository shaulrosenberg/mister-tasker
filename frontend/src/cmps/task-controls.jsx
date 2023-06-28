import { taskService } from "../services/task.service"
import { useState } from "react"

export function TaskControls() {
    const [isWorkerOn, setIsWorkerOn] = useState(false)

    const handleGenerateTasks = async () => {
        // create some random tasks and run them?
    }

    const handleClearTasks = async () => {
        // delete all tasks?
    }

    const handleCreateNewTask = async () => {
        // already implemented
    }

    const handleToggleWorker = async () => {
        setIsWorkerOn(!isWorkerOn)
        try {
            await taskService.runWorker(!isWorkerOn)
        } catch (error) {
            console.error('Failed to toggle task worker', error)
        }
    }

    return (
        <section className="task-controls">
            <button className="generate-tasks" onClick={handleGenerateTasks}>Generate Tasks</button>
            <button className="clear-tasks" onClick={handleClearTasks}>Clear Tasks</button>
            <button className="create-task" onClick={handleCreateNewTask}>Create new task</button>
            <button className={`toggle-worker ${isWorkerOn ? 'worker-on' : ''}`} onClick={handleToggleWorker}>
                {isWorkerOn ? 'Stop Task Worker' : 'Start Task Worker'}
            </button>
        </section>
    )
}
