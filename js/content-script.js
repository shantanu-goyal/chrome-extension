window.onload = () => {
    let windowPerformance = window.performance.getEntriesByName(window.location.href);
    chrome.runtime.sendMessage({performance: windowPerformance})
}