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