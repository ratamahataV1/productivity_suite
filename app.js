/*
//UserProfile module
const user = {
    id:1,
    username: "admin",
    email: "admin@test.com",
    isPremium: true,
    createdAt: "10/4/26",
    preferences: {
        theme: "dark",
        language: "en"
    }
}

function updatePreferences(user, newPreferences){
      
    const updated = {      
        ...user,        //shallow copy
        preferences: { ...user.preferences, ...newPreferences } //merge
}
    return updated;
}

function getUserSummary(user){
    if(!user.username) return null;
    return `${user.username} | ${user.isPremium ? "Premium" : "Free"} | Theme: ${user.preferences.theme}`;
}

//TaskFilter module
const tasks = [
    { title: "Buy groceries", done: true },
    { title: "Learn JS", done: false },
    { title: "Exercise", done: true },
    { title: "Read book", done: false }
];

function filterTasks(tasks, status){
    const filterStatus = status ?? "all";
    let result = [];

 if(filterStatus === "completed"){
        for(let i = 0; i < tasks.length; i++){
            if(tasks[i].done === true){
                result.push(tasks[i]);
            }
        }
        return result;
    }
    if(filterStatus === "pending"){
        for(let i = 0; i<tasks.length; i++){
            if(tasks[i].done === false){
                result.push(tasks[i]);
            }
        }
        return result;
    }
    return tasks;
}

function getTaskStats(tasks){
    let completed = 0;

    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].done === true) completed++;
    }

    return {
        total: tasks.length,
        completed: completed,
        pending: tasks.length - completed,
        completionRate: `${Math.round(completed/tasks.length * 100)}%`
    }
}

function findTaskByTitle(tasks, title){
    if(tasks === null) return null;  // safety check

    for(let i = 0; i < tasks.length; i++){
        if(tasks[i].title === title){
            return tasks[i];
        }
    }
    return null;
}

// Tests
console.log(filterTasks(tasks, "completed"));
console.log(filterTasks(tasks, "pending"));
console.log(filterTasks(tasks, null));
console.log(getTaskStats(tasks));
console.log(findTaskByTitle(tasks, "Learn JS"));
console.log(findTaskByTitle(null, "Learn JS"));
*/

// STATE
let userState = {
    name:"",
    tasks: []
};

//SET NAME
function setName(newName){
    const newState = {
        name: newName,
        tasks: userState.tasks
    };
    return newState;
}

//ADD TASK
function addTask(task){
    const newState = {
        name: userState.name,
        tasks: [
            ...userState.tasks, task
        ]
    };
    return newState;
}
//TESTING 
userState = setName("Doe");
console.log(userState);

userState = addTask("learn Maths");
console.log(userState);
userState = addTask("Gym");
console.log(userState);


//FILTER TASKS
const tasks = [
  { title: "Learn JS", done: true },
  { title: "Gym", done: false },
  { title: "", done: false }
];

function filterTasks(tasks) {
  const result = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    if (task.title && task.done === false) {
      result.push(task);
    }
  }

  return result;
}
//TESTING 
const filtered = filterTasks(tasks);
console.log(filtered);


//TASK COUNTER
function createTaskCounter(){
    let count = 0;
    return {
        add: function(){
            count ++;
            return count;
        },
        reset: function(){
            count = 0;
            return count;
        }
    };
}

const taskCounter = createTaskCounter();
console.log(taskCounter.add());
console.log(taskCounter.add());
console.log(taskCounter.reset());
console.log(taskCounter.add());