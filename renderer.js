
const todayTab = document.getElementById('tab-today')
const weekTab = document.getElementById('tab-week')

const todayContent = document.getElementById('today-results')
const weekContent = document.getElementById('week-results')

const switchTab = (activeTab, newTab) => {
    if (activeTab && newTab) {
        activeTab.classList.remove("display")
        newTab.classList.add("display")
    }
}

todayTab.addEventListener('click', () => {
    switchTab(weekContent, todayContent)
    todayTab.classList.add("active")
    weekTab.classList.remove("active")
})

weekTab.addEventListener('click', () => {
    switchTab(todayContent, weekContent)
    weekTab.classList.add("active")
    todayTab.classList.remove("active")
})

