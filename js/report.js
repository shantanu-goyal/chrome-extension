let sharedData = JSON.parse(localStorage.getItem('networkStorage'));

let { currentTab, currentUrl, networkStorage } = sharedData;
let table = document.querySelector('#network-request-table');
let tableFragment = document.createDocumentFragment();
let title = document.querySelector('.title');

title.innerHTML += " " + currentUrl

for (const item in networkStorage) {
  let tr = document.createElement('tr');
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
  tdStatus.innerText = networkStorage[item].status;
  tdStartTime.innerText = networkStorage[item].startTime;
  tdEndTime.innerText = networkStorage[item].endTime;
  tdDuration.innerText = networkStorage[item].duration + ' ms';
  tr.appendChild(tdReportId);
  tr.appendChild(tdUrl);
  tr.appendChild(tdStatus);
  tr.appendChild(tdStartTime);
  tr.appendChild(tdEndTime);
  tr.appendChild(tdDuration);
  tableFragment.appendChild(tr);
}

table.appendChild(tableFragment);