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
// STATE
// ===============================

let state = {
  tasks: [],
  filter: "all"
};


// ===============================
// SAVE TASKS TO LOCAL STORAGE
// ===============================

function saveTasks() {
  localStorage.setItem(
    "tasks",
    JSON.stringify(state.tasks)
  );
}


// ===============================
// LOAD TASKS FROM LOCAL STORAGE
// ===============================

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    state.tasks = JSON.parse(savedTasks);
  }
}


// ===============================
// RENDER FUNCTION
// ===============================

function render() {
  // καθάρισε το UI
  list.innerHTML = "";

  // COUNTER LOGIC
  let completed = 0;

  // loop στα tasks
  for (let i = 0; i < state.tasks.length; i++) {
    const task = state.tasks[i];

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
          // update title
          task.title = editInput.value;

          // exit edit mode
          task.editing = false;

          // save changes
          saveTasks();

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

      // activate edit mode
      task.editing = true;

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

      // remove task from state
      state.tasks.splice(i, 1);

      // save changes
      saveTasks();

      // rerender UI
      render();
    });

    // ADD BUTTON TO LI
    li.appendChild(deleteBtn);

    // ADD LI TO LIST
    list.appendChild(li);
  }

  // COUNTER LOGIC
  const active = state.tasks.length - completed;

  // COUNTER LOGIC - UPDATE UI
  taskCounter.textContent =
    `All: ${state.tasks.length} | Active: ${active} | Completed: ${completed}`;
}


// ===============================
// EVENT DELEGATION - TOGGLE TASK
// ===============================

list.addEventListener("click", function(event) {
  // get clicked li index
  const index = event.target.dataset.index;

  // if no index stop
  if (index === undefined) return;

  // toggle done
  state.tasks[index].done = !state.tasks[index].done;

  // save changes
  saveTasks();

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

  // ADD TASK TO STATE
  state.tasks.push({
    title: value,
    done: false,
    editing: false
  });

  // save changes
  saveTasks();

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

loadTasks();
render();