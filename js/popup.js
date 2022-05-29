import { getCurrentTab, getCurrentUrl, getNetworkStorage, setCurrentTab, setCurrentUrl, setNetworkStorage } from "./data.js";

const duplicateTab = document.querySelector('#duplicateTab');
const analyseNetwork = document.querySelector('#analyseNetwork');
const generateReport = document.querySelector('#generateReport');

function handleDuplicateButtonClick() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    chrome.tabs.create({
      url: tabs[0].url,
    });
  });
}

function handleAnalyseButtonClick() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (!tabs || !tabs.length) return;
    analyseNetwork.classList.toggle('btn-disable')
    setCurrentTab(tabs[0].id)
    setNetworkStorage({})
    setCurrentUrl(tabs[0].url)
    chrome.tabs.reload(tabs[0].id);
  });
}

function generateReportButtonClick() {
  chrome.tabs.create({
    url: "report.html"
  });

}
duplicateTab.addEventListener('click', handleDuplicateButtonClick);
analyseNetwork.addEventListener('click', handleAnalyseButtonClick);
generateReport.addEventListener('click', generateReportButtonClick);

chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log(req.performance)
  let currentUrl = getCurrentUrl();
  let currentTab = getCurrentTab();
  let performance = req.performance
  localStorage.setItem('performance', JSON.stringify(performance));
  setTimeout(() => {
    let networkStorage = getNetworkStorage();
    localStorage.setItem('networkStorage', JSON.stringify({ currentUrl, currentTab, networkStorage }));
    generateReport.classList.toggle('btn-disable');
  }, 3000);
});


