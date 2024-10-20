import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todolist.css'; // Import the CSS file for styling

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');

    // Fetch tasks from the backend when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Add a new task
    const addTask = async () => {
        if (!newTask) return; // Prevent adding empty tasks
        try {
            const response = await axios.post('http://localhost:5000/tasks', { title: newTask });
            setTasks([...tasks, response.data]);
            setNewTask(''); // Clear input field after adding
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Open modal to edit a task
    const openEditModal = (task) => {
        setEditTaskId(task._id);
        setEditTaskTitle(task.title);
    };

    // Update an existing task
    const updateTask = async () => {
        if (!editTaskTitle) return; // Prevent updating with empty title
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${editTaskId}`, { title: editTaskTitle });
            setTasks(tasks.map(task => (task._id === editTaskId ? response.data : task)));
            closeModal(); // Close modal after updating
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Close the modal
    const closeModal = () => {
        setEditTaskId(null);
        setEditTaskTitle('');
    };

    // Delete a task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks(tasks.filter(task => task._id !== id)); // Remove from UI
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Toggle task completion
    const toggleComplete = async (id, completed) => {
        try {
            const response = await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
            setTasks(tasks.map(task => (task._id === id ? response.data : task))); // Update UI
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="task-input"
            />
            <button onClick={addTask} className="add-task-button">Add Task</button>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task._id} className="task-item">
                        <span
                            className={`task-title ${task.completed ? 'completed' : ''}`}
                            onClick={() => toggleComplete(task._id, task.completed)}
                        >
                            {task.title}
                        </span>
                        <button onClick={() => openEditModal(task)} className="edit-button">Edit</button>
                        <button onClick={() => deleteTask(task._id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>

            {/* Modal for editing tasks */}
            {editTaskId && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Task</h2>
                        <input
                            type="text"
                            value={editTaskTitle}
                            onChange={(e) => setEditTaskTitle(e.target.value)}
                            className="edit-task-input"
                        />
                        <button onClick={updateTask} className="update-button">Update</button>
                        <button onClick={closeModal} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoList;
