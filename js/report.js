import { downloadAsJson, sortTable, downloadAsCSV, showRequests, round } from "./report-utility.js";

// Data stored in the networkStorage object is stored in the localStorage
let sharedData = JSON.parse(localStorage.getItem('networkStorage'));


/**
 * Converts milliseconds to a human readable format
 * 
 * @param {Number} duration 
 * @returns {String}
 */

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor(((duration / (1000 * 60)) + 30) % 60),
    hours = Math.floor(((duration / (1000 * 60 * 60)) + 5) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
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
  let scriptType = document.querySelector('#scriptType');
  let requestType = document.querySelector('#requestType');
  let searchInput = document.querySelector('#search-bar');

  searchInput.addEventListener('keyup', (event) => {
    debounce(() => showRequests(requestType.value, scriptType.value, event.target.value))();
  });

  scriptType.addEventListener('change', (event) => {
    showRequests(requestType.value, event.target.value, searchInput.value)
  })
  requestType.addEventListener('change', (event) => {
    showRequests(event.target.value, scriptType.value, searchInput.value)
  })
}

/**
 * Event Listner to handle the display of the graph
 */
function addDisplayGraphListener() {
  let displayGraph = document.querySelector('.display-graph');
  displayGraph.addEventListener('click', () => {
    let table = document.querySelector('.styled-table');
    let rows = table.rows;
    let graphData = [];
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].style.display !== 'none' && rows[i].cells[2] !== 'Pending' && rows[i].cells[2] !== 'error') {
        graphData.push({
          'url': rows[i].cells[1].innerText,
          'duration': rows[i].cells[5].innerText
        });
      }
    }
    localStorage.setItem('graphData', JSON.stringify(graphData));
    window.location.href = './graph.html';
  });
};


/**
 * Renders the table on the report page
 */

function renderReport() {
  let { currentUrl, networkStorage } = sharedData;
  let table = document.querySelector('.table-body');
  let tableFragment = document.createDocumentFragment();
  let title = document.querySelector('.title');
  title.innerHTML += " " + currentUrl
  for (const item in networkStorage) {
    let tr = document.createElement('tr');
    tr.setAttribute('request-id', item)
    let tdReportId = document.createElement('td');
    let tdUrl = document.createElement('td');
    let tdStatus = document.createElement('td');
    let tdStartTime = document.createElement('td');
    let tdEndTime = document.createElement('td');
    let tdDuration = document.createElement('td');
    if (networkStorage[item].duration == undefined) {
      networkStorage[item].duration = 0;
    }
    tdReportId.innerText = item;
    tdUrl.innerText = networkStorage[item].url;
    tdUrl.title = networkStorage[item].url;
    tdStatus.innerText = networkStorage[item].status;
    tdStartTime.innerText = msToTime(networkStorage[item].startTime);
    tdEndTime.innerText = msToTime(networkStorage[item].endTime);
    tdDuration.innerText = round(networkStorage[item].duration);
    tr.appendChild(tdReportId);
    tr.appendChild(tdUrl);
    tr.appendChild(tdStatus);
    tr.appendChild(tdStartTime);
    tr.appendChild(tdEndTime);
    tr.appendChild(tdDuration);
    tableFragment.appendChild(tr);
  }
  table.appendChild(tableFragment);
}


renderReport();
addSortingListener();
addDownloadButtonHandler();
addFilterListener()
addDisplayGraphListener();