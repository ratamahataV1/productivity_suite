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
      //shallow copy
    const updated = {
        ...user,
        preferences: { ...user.preferences, ...newPreferences }
}
    return updated;
}

function getUserSummary(user){
    if(!user.username) return null;
    return `${user.username} | ${user.isPremium ? "Premium" : "Free"} | Theme: ${user.preferences.theme}`;
}