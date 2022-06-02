import { downloadAsJson, sortTable, downloadAsCSV, showRequests, round, previewAsJSON } from "./report-utility.js";

// Data stored in the networkStorage object is stored in the localStorage

let requestData = 'All';
let scriptData = 'All';

function getRequestData() {
  return requestData;
}

function setRequestData(data) {
  requestData = data;
}

function getScriptData() {
  return scriptData;
}

function setScriptData(data) {
  scriptData = data;
}


/**
 * Converts milliseconds to a human readable format
 * 
 * @param {Number} duration 
 * @returns {String}
 */

function msToTime(duration) {
  return round(duration / 1000);
}



/**
 * Event Listener to handle the sorting of the table
 * 
 */


function addSortingListener() {
  let headerRow = document.querySelector('.header-row');
  headerRow.addEventListener('click', function (e) {
    let index = Number(e.target.dataset.index);
    sortTable(index);
  });
}


/**
 * Adds an event listener to the download button
 * 
 */

function addDownloadButtonHandler() {
  let button = document.querySelector('.download-button');
  let downloadType = document.querySelector('#downloadType')
  button.addEventListener('click', () => {
    downloadType.value == 'JSON' ? downloadAsJson() : downloadAsCSV();
  });
}


function addPreviewButtonHandler() {
  let button = document.querySelector('.preview-button');
  button.addEventListener('click', () => {
    previewAsJSON();
  });
}



function getData(url, tabId) {
  const data = {
    resources: [],
    perfTiming: []
  };
  let windowPerformance = window.performance.getEntriesByName(url);
  data.resources = window.performance.getEntriesByType('resource');
  data.perfTiming = window.performance.timing;
  let networkStorage = {};
  for (const item in data.resources) {
    let resource = data.resources[item];
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
  console.log(data);
  localStorage.setItem('networkStorage', JSON.stringify({ currentUrl: url, networkStorage, performance: windowPerformance, tabId }));
}

function addRefreshButtonHandler() {
  let button = document.querySelector('.refresh-button');
  button.addEventListener('click', () => {
    chrome.tabs.query({}, tabs => {
      const { tabId, currentUrl } = JSON.parse(localStorage.getItem('networkStorage'));
      chrome.scripting.executeScript({
        target: { tabId },
        func: getData,
        args: [currentUrl, tabId]
      });
      renderReport();
    });
  });
}


/**
 * Debounce function to handle the search bar. It is used to reduce the number of requests. It fires after * every keyup event and waits for 300ms before firing the function.
 * 
 * @param {Function} func 
 * @param {Number} timeout 
 * @returns 
 */

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

/**
 * Adds event listeners to the different filters in the report page
 */

function addFilterListener() {
  let searchInput = document.querySelector('#search-bar');
  searchInput.addEventListener('keyup', (event) => {
    debounce(() => showRequests(getRequestData(), getScriptData(), event.target.value))();
  });

  $('input[type="radio"]').on('click', function (e) {
    if (e.target.name == 'script_type') {
      setScriptData(e.target.value);
    }
    else if (e.target.name == 'request_type') {
      setRequestData(e.target.value);
    }
    showRequests(getRequestData(), getScriptData(), searchInput.value);
  });

}

/**
 * Renders the table on the report page
 */

function renderReport() {
  let sharedData = JSON.parse(localStorage.getItem('networkStorage'));
  let { currentUrl, networkStorage } = sharedData;
  let table = document.querySelector('.table-body');
  let tableFragment = document.createDocumentFragment();
  let title = document.querySelector('.title');;
  title.innerHTML = "Network Report for:- " + `<a href=${currentUrl}>${currentUrl}</a>`
  for (const item in networkStorage) {
    let tr = document.createElement('tr');
    tr.setAttribute('request-id', item)
    tr.setAttribute('data-type', networkStorage[item].type);
    let tdReportId = document.createElement('td');
    let tdUrl = document.createElement('td');
    let tdType = document.createElement('td');
    let tdStatus = document.createElement('td');
    let tdStartTime = document.createElement('td');
    let tdEndTime = document.createElement('td');
    let tdDuration = document.createElement('td');
    if (networkStorage[item].duration == undefined) {
      networkStorage[item].duration = 0;
    }
    tdReportId.innerText = item;
    tdType.innerText = networkStorage[item].type;
    tdUrl.innerText = networkStorage[item].url;
    tdUrl.title = networkStorage[item].url;
    tdStatus.innerText = networkStorage[item].status;
    tdStartTime.innerText = msToTime(networkStorage[item].startTime);
    tdEndTime.innerText = msToTime(networkStorage[item].endTime);
    tdDuration.innerText = round(networkStorage[item].duration);
    tr.appendChild(tdReportId);
    tr.appendChild(tdUrl);
    tr.appendChild(tdType);
    tr.appendChild(tdStatus);
    tr.appendChild(tdStartTime);
    tr.appendChild(tdEndTime);
    tr.appendChild(tdDuration);
    tableFragment.appendChild(tr);
  }
  table.replaceChildren(tableFragment);
}

function init() {
  renderReport();
  addSortingListener();
  addDownloadButtonHandler();
  addRefreshButtonHandler();
  addFilterListener();
  addPreviewButtonHandler();
  $(document).on('click', '.dropdown-menu label', function (e) {
    e.stopPropagation();
  });
}

init();
