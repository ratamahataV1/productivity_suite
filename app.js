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
    this.tasks.push({
      title: title,
      done: false,
      editing: false
    });
  }

  // DELETE TASK
  deleteTask(index) {
    this.tasks.splice(index, 1);
  }

  // TOGGLE TASK DONE / NOT DONE
  toggleTask(index) {
    this.tasks[index].done = !this.tasks[index].done;
  }

  // START EDIT MODE
  startEditing(index) {
    this.tasks[index].editing = true;
  }

  // EDIT TASK TITLE
  editTask(index, newTitle) {
    this.tasks[index].title = newTitle;
    this.tasks[index].editing = false;
  }

  // GET TASKS
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
  // καθάρισε το UI
  list.innerHTML = "";

  // get tasks from TaskManager
  const tasks = taskManager.getTasks();

  // COUNTER LOGIC
  let completed = 0;

  // loop στα tasks
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    // COUNTER LOGIC
    if (task.done) {
      completed++;
    }

    // FILTER LOGIC
    if (state.filter === "active" && task.done) continue;

    if (state.filter === "completed" && !task.done) continue;

    // CREATE LI
    const li = document.createElement("li");

    // dataset index για event delegation
    li.dataset.index = i;

    // EDIT MODE
    if (task.editing) {
      // CREATE INPUT
      const editInput = document.createElement("input");

      // input value
      editInput.value = task.title;

      // stop bubbling
      editInput.addEventListener("click", function(event) {
        event.stopPropagation();
      });

      // SAVE ON ENTER
      editInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          // update title through TaskManager
          taskManager.editTask(i, editInput.value);

          // save changes
          taskManager.saveTasks();

          // rerender UI
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
      // stop bubbling
      event.stopPropagation();

      // activate edit mode through TaskManager
      taskManager.startEditing(i);

      // rerender UI
      render();
    });

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "❌";

    // DELETE EVENT
    deleteBtn.addEventListener("click", function(event) {
      // stop bubbling
      event.stopPropagation();

      // delete task through TaskManager
      taskManager.deleteTask(i);

      // save changes
      taskManager.saveTasks();

      // rerender UI
      render();
    });

    // ADD BUTTON TO LI
    li.appendChild(deleteBtn);

    // ADD LI TO LIST
    list.appendChild(li);
  }

  // COUNTER LOGIC
  const active = tasks.length - completed;

  // COUNTER LOGIC - UPDATE UI
  taskCounter.textContent =
    `All: ${tasks.length} | Active: ${active} | Completed: ${completed}`;
}


// ===============================
// EVENT DELEGATION - TOGGLE TASK
// ===============================

list.addEventListener("click", function(event) {
  // get clicked li index
  const index = event.target.dataset.index;

  // if no index stop
  if (index === undefined) return;

  // toggle done through TaskManager
  taskManager.toggleTask(index);

  // save changes
  taskManager.saveTasks();

  // rerender UI
  render();
});


// ===============================
// ADD BUTTON EVENT
// ===============================

addBtn.addEventListener("click", function() {
  // get input value
  const value = taskInput.value;

  // empty validation
  if (!value) return;

  // add task through TaskManager
  taskManager.addTask(value);

  // save changes
  taskManager.saveTasks();

  // rerender UI
  render();

  // clear input
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

// load saved tasks
taskManager.loadTasks();

// first render
render();