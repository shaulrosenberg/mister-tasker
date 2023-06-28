import { useState } from 'react'

export function AddTask({ onAddTask }) {
    const [title, setTitle] = useState('')
    const [importance, setImportance] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        // Create a new task object
        const newTask = {
            title,
            importance: Number(importance),
            status: 'new',
            description: '',
            createdAt: Date.now(),
            lastTriedAt: null,
            triesCount: 0,
            doneAt: null,
            errors: [],
        }

        // Pass the new task object to the parent component
        onAddTask(newTask)

        // Reset the input fields
        setTitle('')
        setImportance('')
    }

    return (
        <form className="add-task" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Importance (1-3)"
                min="1"
                max="3"
                value={importance}
                onChange={(ev) => setImportance(ev.target.value)}
                required
            />
            <button type="submit">Add Task</button>
        </form>
    )
}
