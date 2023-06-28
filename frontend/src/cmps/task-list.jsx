import { TaskPreview } from "./task-preview.jsx"
import { AddTask } from "./add-task.jsx"

export function TaskList({ tasks, onDeleteTask, onAddTask }) {
    return (
        <table className="task-list">
            <thead>
                <tr>
                    <td>Title</td>
                    <td>Importance</td>
                    <td>Status</td>
                    <td>Tries Count</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task => <TaskPreview key={task._id} task={task} onDeleteTask={onDeleteTask} onRetryTask={onAddTask} />)}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="5">
                        <AddTask onAddTask={onAddTask} />
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}