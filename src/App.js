import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'; // Import the CSS file

const API_TOKEN = "TOKEN"; // Replace with your Todoist API token
const PROJECT_ID = "PROJECT_ID"; // Replace with your Todoist project ID
const API_URL = "https://api.todoist.com/rest/v2";

// Predefined tags with colors
const predefinedTags = [
  { name: "Anyone", color: "#FF5733" },
  { name: "Ordenselev-1IM1", color: "#33FF57" },
  { name: "Ordenselev-1IM2", color: "#3357FF" },
  { name: "Ordenselev-1IM3", color: "#FF33A1" },
  { name: "100XP", color: "#808080" },
  { name: "200XP", color: "#808080" },
  { name: "300XP", color: "#808080" },
  { name: "500XP", color: "#808080" },
  { name: "1000XP", color: "#808080" },

];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch all tasks in the project
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        params: { project_id: PROJECT_ID },
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    const taskData = {
      content: newTask,
      project_id: PROJECT_ID,
      labels: [...selectedTags, ...(customTag ? [customTag] : [])], // Use selected tags and custom tag
    };

    // Ensure the due date is formatted correctly
    if (dueDate) {
      taskData.due_date = dueDate; // Set due date if provided
    }

    console.log("Task Data:", taskData); // Log the task data

    try {
      await axios.post(
        `${API_URL}/tasks`,
        taskData,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      setNewTask("");
      setSelectedTags([]);
      setCustomTag("");
      setDueDate("");
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Mark a task as complete
  const completeTask = async (taskId) => {
    try {
      await axios.post(
        `${API_URL}/tasks/${taskId}/close`,
        {},
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="app-container">
      <h1>Public Todoist Board</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <div className="tag-selector">
          <label>Select Tags:</label>
          <div className="tag-dropdown">
            {predefinedTags.map((tag) => (
              <div
                key={tag.name}
                className={`tag-item ${selectedTags.includes(tag.name) ? "selected" : ""}`}
                style={{ backgroundColor: tag.color }}
                onClick={() => toggleTag(tag.name)}
              >
                {selectedTags.includes(tag.name) && <span className="checkmark">✔️</span>}
                {tag.name}
              </div>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          placeholder="Add a custom tag (MAX 1)"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span>{task.content}</span>
            <span className="task-tags">{task.labels.join(", ")}</span>
            <span className="task-due-date">{task.due ? task.due.date : "No due date"}</span>
            <button onClick={() => completeTask(task.id)}>Complete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;