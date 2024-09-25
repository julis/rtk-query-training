import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching tasks');
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      try {
        const response = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]);
        setNewTask({ title: '', description: '' });
      } catch (err) {
        setError('Error adding task');
      }
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      setError('Error updating task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingTask),
        });
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
      } catch (err) {
        setError('Error updating task');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="New task title"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between border p-2">
            {editingTask && editingTask.id === task.id ? (
              <form onSubmit={handleSaveEdit} className="flex-grow mr-2">
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as 'pending' | 'completed' })}
                  className="border p-2 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </form>
            ) : (
              <div className="flex-grow">
                <h3 className={`font-bold ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
              </div>
            )}
            <div>
              {editingTask && editingTask.id === task.id ? (
                <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                  Save
                </button>
              ) : (
                <>
                  <button onClick={() => handleToggleTask(task)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                    Toggle Status
                  </button>
                  <button onClick={() => handleEditTask(task)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                    Edit
                  </button>
                </>
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;