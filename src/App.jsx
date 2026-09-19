import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

//Main app functionality
function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

  //Task loading function that fetches tasks from the database and updates the state
  async function loadTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setTasks(data)
  }

  //Task addition function that inserts a new task into the database and reloads the task list
  async function addTask(e) {
    e.preventDefault()

    if (!title.trim()) return

    const { error } = await supabase
      .from('tasks')
      .insert({ title: title.trim() })

    if (error) {
      console.error(error)
      return
    }

    setTitle('')
    loadTasks()
  }

  //Task toggle function that updates the completed status of a task in the database and reloads the task list 
  async function toggleTask(task) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id)

    if (error) {
      console.error(error)
      return
    }

    loadTasks()
  }

  //Task deletion function that removes a task from the database and reloads the task list
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    loadTasks()
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <p className="subtitle">Ethan M, Z23650406</p>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
  <label>
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => toggleTask(task)}
    />

    <span className={task.completed ? 'completed' : ''}>
      {task.title}
    </span>
  </label>

  <button onClick={() => deleteTask(task.id)}>
    Delete
  </button>
</li>

        ))}
      </ul>
    </div>
  )
}

export default App
