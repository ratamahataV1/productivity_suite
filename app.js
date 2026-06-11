// ===============================
// SELECTORS
// ===============================

const addBtn = document.querySelector("#addBtn");
const taskInput = document.querySelector("#taskInput");
const list = document.querySelector("#taskList");

const allBtn = document.querySelector("#allBtn");
const activeBtn = document.querySelector("#activeBtn");
const completedBtn = document.querySelector("#completedBtn");

const taskCounter = document.querySelector("#taskCounter");


// ===============================
// TASK MANAGER CLASS
// ===============================

class TaskManager {

  // INITIAL STATE
  constructor() {
    this.tasks = [];
  }

  // ADD TASK
  addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      done: false,
      editing: false
    };

    this.tasks.push(newTask);
  }

  // DELETE TASK BY ID
  deleteTask(taskId) {
    const updatedTasks = [];

    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      if (task.id !== taskId) {
        updatedTasks.push(task);
      }
    }

    this.tasks = updatedTasks;
  }

  // TOGGLE TASK BY ID
  toggleTask(taskId) {
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      if (task.id === taskId) {
        task.done = !task.done;
      }
    }
  }

  // START EDIT MODE BY ID
  startEditing(taskId) {
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      if (task.id === taskId) {
        task.editing = true;
      }
    }
  }

  // EDIT TASK TITLE BY ID
  editTask(taskId, newTitle) {
    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      if (task.id === taskId) {
        task.title = newTitle;
        task.editing = false;
      }
    }
  }

  // GET ALL TASKS
  getTasks() {
    return this.tasks;
  }

  // SAVE TASKS TO LOCAL STORAGE
  saveTasks() {
    localStorage.setItem(
      "tasks",
      JSON.stringify(this.tasks)
    );
  }

  // LOAD TASKS FROM LOCAL STORAGE
  loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}


// ===============================
// CREATE TASK MANAGER INSTANCE
// ===============================

const taskManager = new TaskManager();


// ===============================
// UI STATE
// ===============================

let state = {
  filter: "all"
};


// ===============================
// RENDER FUNCTION
// ===============================

function render() {
  // CLEAR UI
  list.innerHTML = "";

  // GET TASKS FROM TASK MANAGER
  const tasks = taskManager.getTasks();

  // COUNTER LOGIC
  let completed = 0;

  // LOOP TASKS
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // COUNT COMPLETED TASKS
    if (task.done) {
      completed++;
    }

    // FILTER LOGIC
    if (state.filter === "active" && task.done) continue;

    if (state.filter === "completed" && !task.done) continue;

    // CREATE LI
    const li = document.createElement("li");

    // SAVE TASK ID IN DOM
    li.dataset.id = task.id;

    // EDIT MODE
    if (task.editing) {
      // CREATE INPUT
      const editInput = document.createElement("input");

      // SET INPUT VALUE
      editInput.value = task.title;

      // STOP CLICK FROM TOGGLING TASK
      editInput.addEventListener("click", function(event) {
        event.stopPropagation();
      });

      // SAVE EDIT ON ENTER
      editInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          const taskId = Number(li.dataset.id);

          // EDIT TASK THROUGH TASK MANAGER
          taskManager.editTask(taskId, editInput.value);

          // SAVE CHANGES
          taskManager.saveTasks();

          // RERENDER UI
          render();
        }
      });

      // ADD INPUT TO LI
      li.appendChild(editInput);

    } else {
      // NORMAL MODE
      li.textContent = task.title;
    }

    // DONE STYLE
    if (task.done) {
      li.style.textDecoration = "line-through";
    }

    // DOUBLE CLICK → EDIT MODE
    li.addEventListener("dblclick", function(event) {
      // STOP BUBBLING
      event.stopPropagation();

      const taskId = Number(li.dataset.id);

      // START EDITING THROUGH TASK MANAGER
      taskManager.startEditing(taskId);

      // RERENDER UI
      render();
    });

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "❌";

    // DELETE EVENT
    deleteBtn.addEventListener("click", function(event) {
      // STOP BUBBLING
      event.stopPropagation();

      const taskId = Number(li.dataset.id);

      // DELETE THROUGH TASK MANAGER
      taskManager.deleteTask(taskId);

      // SAVE CHANGES
      taskManager.saveTasks();

      // RERENDER UI
      render();
    });

    // ADD DELETE BUTTON TO LI
    li.appendChild(deleteBtn);

    // ADD LI TO LIST
    list.appendChild(li);
  }

  // ACTIVE COUNTER
  const active = tasks.length - completed;

  // UPDATE COUNTER UI
  taskCounter.textContent =
    `All: ${tasks.length} | Active: ${active} | Completed: ${completed}`;
}


// ===============================
// EVENT DELEGATION - TOGGLE TASK
// ===============================

list.addEventListener("click", function(event) {
  // GET CLICKED TASK ID
  const taskId = event.target.dataset.id;

  // IF CLICKED ELEMENT HAS NO ID, STOP
  if (taskId === undefined) return;

  // TOGGLE THROUGH TASK MANAGER
  taskManager.toggleTask(Number(taskId));

  // SAVE CHANGES
  taskManager.saveTasks();

  // RERENDER UI
  render();
});


// ===============================
// ADD BUTTON EVENT
// ===============================

addBtn.addEventListener("click", function() {
  // GET INPUT VALUE
  const value = taskInput.value;

  // EMPTY VALIDATION
  if (!value) return;

  // ADD TASK THROUGH TASK MANAGER
  taskManager.addTask(value);

  // SAVE CHANGES
  taskManager.saveTasks();

  // RERENDER UI
  render();

  // CLEAR INPUT
  taskInput.value = "";
});


// ===============================
// FILTER BUTTONS
// ===============================

// ALL
allBtn.addEventListener("click", function() {
  state.filter = "all";

  render();
});

// ACTIVE
activeBtn.addEventListener("click", function() {
  state.filter = "active";

  render();
});

// COMPLETED
completedBtn.addEventListener("click", function() {
  state.filter = "completed";

  render();
});


// ===============================
// INIT APP
// ===============================

// LOAD SAVED TASKS
taskManager.loadTasks();

// FIRST RENDER
render();