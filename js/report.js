let sharedData = JSON.parse(localStorage.getItem('networkStorage'));

//Finding a particular string that ends with a particular string
function findStringEndsWith(string, substring) {
  return string.indexOf(substring, string.length - substring.length) !== -1;
}

// Timestamp to human readable date and time
function timestampToDate(timestamp) {
  return new Date(timestamp).getMilliseconds();
}


//Round of to 2 decimal places
function round(value) {
  return Math.round(value * 100) / 100;
}


function renderReport() {
  let { currentUrl, networkStorage } = sharedData;
  let table = document.querySelector('#network-request-table');
  let tableFragment = document.createDocumentFragment();
  let title = document.querySelector('.title');

  title.innerHTML += " " + currentUrl

  for (const item in networkStorage) {
    if (findStringEndsWith(networkStorage[item].url, '.js')) {
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
      tdStartTime.innerText = timestampToDate(networkStorage[item].startTime);
      tdEndTime.innerText = timestampToDate(networkStorage[item].endTime);
      tdDuration.innerText = round(networkStorage[item].duration) + ' ms';
      tr.appendChild(tdReportId);
      tr.appendChild(tdUrl);
      tr.appendChild(tdStatus);
      tr.appendChild(tdStartTime);
      tr.appendChild(tdEndTime);
      tr.appendChild(tdDuration);
      tableFragment.appendChild(tr);
    }
  }
  table.appendChild(tableFragment);
}

renderReport();