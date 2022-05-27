import { getCurrentTab, setCurrentTab, setNetworkStorage } from "./data.js";

const duplicateTab = document.querySelector('#duplicateTab');
const analyseNetwork = document.querySelector('#analyseNetwork');

function handleDuplicateButtonClick() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    chrome.tabs.create({
      url: tabs[0].url
    });
  });
}

function handleAnalyseButtonClick() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if(!tabs || !tabs.length)return;
    if(getCurrentTab()){
      setCurrentTab(null)
      analyseNetwork.innerText = 'Click To Analyse'
      return
    }
    analyseNetwork.innerText = 'Click To Stop Analysis'
    setCurrentTab(tabs[0].id)
    setNetworkStorage({})
    chrome.tabs.reload(tabs[0].id);
  });
}

duplicateTab.addEventListener('click', handleDuplicateButtonClick);
analyseNetwork.addEventListener('click', handleAnalyseButtonClick);