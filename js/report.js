import { downloadAsJson, sortTable, downloadAsCSV, showRequests, handleSearchInput, round } from "./report-utility.js";
let sharedData = JSON.parse(localStorage.getItem('networkStorage'));


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

function addSortingListener() {
  let headerRow = document.querySelector('.header-row');
  headerRow.addEventListener('click', function (e) {
    let index = Number(e.target.dataset.index);
    sortTable(index);
  });
}


function addDownloadButtonHandler() {
  let button = document.querySelector('.download-button');
  let downloadType = document.querySelector('#downloadType')
  button.addEventListener('click', () => {
    downloadType.value == 'JSON' ? downloadAsJson() : downloadAsCSV();
  });
}

function addFilterListener() {
  let scriptType = document.querySelector('#scriptType');
  let requestType = document.querySelector('#requestType');
  let searchInput = document.querySelector('#search-bar');

  searchInput.addEventListener('keyup', handleSearchInput);

  scriptType.addEventListener('change', (event) => {
    showRequests(requestType.value, event.target.value)
  })
  requestType.addEventListener('change', (event) => {
    showRequests(event.target.value, scriptType.value)
  })
}

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