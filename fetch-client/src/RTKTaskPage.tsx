import React, { useState } from 'react';
import { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from './api/taskApi';

const RTKTaskPage: React.FC = () => {
  const { data: tasks, error, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      await addTask({ title: newTaskTitle.trim(), description: newTaskDescription.trim() });
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleToggleTask = async (task: { id: number; title: string; description: string; status: string }) => {
    await updateTask({ ...task, status: task.status === 'pending' ? 'completed' : 'pending' });
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">RTK Query Tasks</h1>
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Task description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>
      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={() => handleToggleTask(task)}
                className="mr-2"
              />
              <span className={task.status === 'completed' ? 'line-through' : ''}>
                {task.title} - {task.description}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RTKTaskPage;