/**
 *  Get the performance metric data from the page and send it to the the 'popup.js' script 
 */
window.onload = () => {
    let windowPerformance = window.performance.getEntriesByName(window.location.href);
    chrome.runtime.sendMessage({ performance: windowPerformance })
}