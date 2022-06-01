/**
 *  Get the performance metric data from the page and send it to the the 'popup.js' script 
 */

const data = {
    resources: [],
    perfTiming: []
};

export function start() {
    setInterval(() => {
        let windowPerformance = window.performance.getEntriesByName(window.location.href);
        data.resources = window.performance.getEntriesByType('resource');
        data.perfTiming = window.performance.timing;
        console.log(data);
        chrome.runtime.sendMessage({ performance: windowPerformance, data, url: window.location.href });
    }, 4000);
}

