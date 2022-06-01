import { setCurrentTab, setCurrentUrl, setNetworkStorage } from "./data.js";

const duplicateTab = document.querySelector('#duplicateTab');
const analyseNetwork = document.querySelector('#analyseNetwork');
const generateReport = document.querySelector('#generateReport');



function start(url) {
  const myExtId = chrome.runtime.id;
  const data = {
    resources: [],
    perfTiming: []
  };
  setInterval(() => {
    let windowPerformance = window.performance.getEntriesByName(url);
    data.resources = window.performance.getEntriesByType('resource');
    data.perfTiming = window.performance.timing;
    console.log(data);
    chrome.runtime.sendMessage(myExtId, { performance: windowPerformance, data, url });
  }, 4000);
}


/**
  * Handles Duplicate Tab button click event
  * 
  * Creates a new tab with the same url as the current tab
  * 
  * @param {Event} event
  * 
*/
function handleDuplicateButtonClick(event) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    chrome.tabs.create({
      url: tabs[0].url,
    });
  });
}

/**
  * Handles Analyse Button Click event
  *
  * It sets the current tab and url by the setter function. It then reloads the page to capture
  * network information
  * 
  * @paramm {Event} event
  * 
  */
function handleAnalyseButtonClick() {
  const button = document.querySelector('#analyseNetwork');
  button.innerHTML = "Analysing...";
  button.classList.toggle('btn-disable');
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    setCurrentTab(tabs[0].id)
    setCurrentUrl(tabs[0].url)
    setNetworkStorage({});
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: start,
      args: [tabs[0].url]
    });
  })
};

/**
  * Handles the Generate Report button click event
  *
  * It opens the page 'report.html' in a new tab
  *
  * @param {Event} event
  */

function generateReportButtonClick(event) {
  chrome.tabs.create({
    url: "report.html"
  });
}


//Event Listners
duplicateTab.addEventListener('click', handleDuplicateButtonClick);
analyseNetwork.addEventListener('click', handleAnalyseButtonClick);
generateReport.addEventListener('click', generateReportButtonClick);



/**
  * Recieves the message from the content script and injects the network information into the local storage
  * @param {Request} req
  * @param {Sender} sender
  * @param {Response} res
  */

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log(req);
  let networkStorage = {};
  for (const item in req.data.resources) {
    let resource = req.data.resources[item];
    let requestId = item;
    let url = resource.name;
    let type = resource.initiatorType;
    let startTime = resource.startTime;
    let endTime = resource.responseEnd;
    let duration = resource.duration;
    networkStorage[requestId] = {
      url,
      type,
      startTime,
      endTime,
      duration,
      status: "complete"
    }
  }
  localStorage.setItem('networkStorage', JSON.stringify({ currentUrl: req.url, networkStorage }));
});


