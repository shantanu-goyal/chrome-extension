let domLoading;
/**
 *  Get the performance metric data from the page and send it to the the 'popup.js' script 
 */
const myInterval  = setInterval(() => {
    let perfEntry = performance.timing;
    if (perfEntry.loadEventEnd > 0) {
        chrome.runtime.sendMessage({ performance: perfEntry })
        clearInterval(myInterval)
    }
},1000)

