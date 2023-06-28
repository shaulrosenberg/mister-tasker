import { useState } from "react"
import { runTask } from "../store/task.actions"

export function TaskPreview({ task, onDeleteTask, onRetryTask }) {
    const [isExpanded, setIsExpanded] = useState(false)

    function onClickPreview() {
        setIsExpanded(prevIsExpanded => !prevIsExpanded)
    }

    const renderActionButton = () => {
        if (task.status === 'done') {
            return (
                <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDeleteTask(task._id) }}>Delete</button>
            )
        } else if (task.status === 'failed') {
            return (
                <button className="retry-button" onClick={(e) => { e.stopPropagation(); runTask(task) }}>Retry</button>
            )
        }
        else if (task.status === 'new') {
            return (
                // add run task
                <button className="run-button" onClick={(e) => { e.stopPropagation(); runTask(task)}}>Run</button>
            )
        } else {
            return null
        }
    }

    return (
        <>
            <tr className="task-preview" onClick={onClickPreview}>
                <td>{task.title}</td>
                <td>{task.importance}</td>
                <td>{task.status}</td>
                <td>{task.triesCount}</td>
                <td>
                    {renderActionButton()}
                </td>
            </tr>
            {
                isExpanded &&
                <tr className="expanded-list-item">
                    <td colSpan="5">
                        <p>{task.description}</p>
                    </td>
                </tr>
            }
        </>
    )
}
