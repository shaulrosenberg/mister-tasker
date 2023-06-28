import { useState } from "react"

export function TaskFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  function handleChange({ target }) {
    const { name, value } = target
    const updatedValue = target.type === "number" ? +value : value
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [name]: updatedValue }))
    onSetFilterBy({ ...filterByToEdit, [name]: updatedValue })
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    onSetFilterBy(filterByToEdit)
  }

  return (
    <section className="task-filter">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="txt"
          value={filterByToEdit.txt}
          onChange={handleChange}
        />
        <button type="submit">Apply Filter</button>
      </form>
    </section>
  )
}
