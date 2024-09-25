import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './api/taskApi';
import TaskPage from './TaskPage';
import RTKTaskPage from './RTKTaskPage';
import './App.css';

const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
              </li>
              <li>
                <Link to="/tasks" className="text-white hover:text-gray-300">Fetch Tasks</Link>
              </li>
              <li>
                <Link to="/rtk-tasks" className="text-white hover:text-gray-300">RTK Query Tasks</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="/rtk-tasks" element={<RTKTaskPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

function Home() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold">Welcome to the Task Manager</h1>
      <p className="mt-4">Click on the links above to view and manage your tasks.</p>
    </div>
  );
}

export default App;
