const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const todoList = document.getElementById("todoList");

let tasks = [];
try {
  const savedTasks = localStorage.getItem("tasks");
  tasks = savedTasks ? JSON.parse(savedTasks) : [];
  console.log("Successfully loaded tasks:", tasks);
} catch (error) {
  console.error("Error loading tasks from localStorage:", error);
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Successfully saved tasks:", tasks);
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    alert("Could not save tasks. Local storage might be full or disabled.");
  }
}

function isValidTask(task) {
  return (
    task &&
    typeof task.id === "number" &&
    typeof task.text === "string" &&
    typeof task.completed === "boolean"
  );
}

function createTaskElement(task) {
  if (!isValidTask(task)) {
    console.error("Invalid task data:", task);
    return null;
  }

  const li = document.createElement("li");
  li.className = `todo-item ${task.completed ? "completed" : ""}`;

  const taskText = document.createElement("span");
  taskText.className = "todo-text";
  taskText.textContent = task.text;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "todo-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
  completeBtn.addEventListener("click", () => toggleComplete(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(taskText);
  li.appendChild(actionsDiv);

  return li;
}

function renderTasks() {
  try {
    todoList.innerHTML = "";
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      if (taskElement) {
        todoList.appendChild(taskElement);
      }
    });
  } catch (error) {
    console.error("Error rendering tasks:", error);
    todoList.innerHTML =
      '<li class="todo-item error">Error displaying tasks. Please refresh the page.</li>';
  }
}

function addTask(text) {
  try {
    if (!text || text.trim() === "") {
      console.warn("Attempted to add empty task");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    console.log("Successfully added new task:", newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Failed to add task. Please try again.");
  }
}

document.getElementById("add-task-btn").addEventListener("click", function () {
  const input = document.getElementById("new-task-input");
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = "";
  }
});

function toggleComplete(id) {
  try {
    if (!id || typeof id !== "number") {
      console.error("Invalid task ID:", id);
      return;
    }

    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      console.error("Task not found:", id);
      return;
    }

    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasks();
    renderTasks();
    console.log("Successfully toggled task completion:", id);
  } catch (error) {
    console.error("Error toggling task completion:", error);
  }
}

function deleteTask(id) {
  try {
    if (!id || typeof id !== "number") {
      console.error("Invalid task ID:", id);
      return;
    }

    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);

    if (tasks.length === initialLength) {
      console.warn("No task found with ID:", id);
      return;
    }

    saveTasks();
    renderTasks();
    console.log("Successfully deleted task:", id);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

addTaskButton.addEventListener("click", () => {
  try {
    addTask(taskInput.value);
  } catch (error) {
    console.error("Error in add task button handler:", error);
  }
});

taskInput.addEventListener("keypress", (e) => {
  try {
    if (e.key === "Enter") {
      addTask(taskInput.value);
    }
  } catch (error) {
    console.error("Error in input keypress handler:", error);
  }
});

const cssLink = document.querySelector('link[href="styles.css"]');
if (cssLink) {
  cssLink.addEventListener("error", () => {
    console.error("Failed to load styles.css");
  });
}

try {
  renderTasks();
  console.log("Initial render completed successfully");
} catch (error) {
  console.error("Error during initial render:", error);
}
