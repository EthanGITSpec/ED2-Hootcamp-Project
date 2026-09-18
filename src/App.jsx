import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)


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
            <span
              className={task.completed ? 'completed' : ''}
              onClick={() => toggleTask(task)}
            >
              {task.title}
            </span>

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
