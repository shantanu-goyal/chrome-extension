let { networkStorage, currentTab, currentUrl } = JSON.parse(localStorage.getItem('networkStorage'));
let currentHost = new URL(currentUrl).hostname.replace('www.', '');

function isJSURL(url) {
  let pathname = new URL(url).pathname
  return pathname.substring(pathname.length - 3) === '.js'
}

function isDownloadableRow(requestId) {
  return document.querySelector(`[request-id='${requestId}']`).style.display !== 'none'
}

function getCSV() {
  let csvArray = [];
  let row = ['Request Id', 'Url', 'Status', 'Start Time', 'End Time', 'Duration (ms)']
  csvArray.push(row);
  for (const key in networkStorage) {
    if (!isDownloadableRow(key)) continue
    row = [key]
    for (const itemKey in networkStorage[key]) {
      row.push(networkStorage[key][itemKey])
    }
    csvArray.push(row);
  }
  return csvArray;
}

function downloadFile(filename, downloadURL) {
  let downloadButtonAnchorTag = document.createElement('a')
  downloadButtonAnchorTag.setAttribute("href", downloadURL);
  downloadButtonAnchorTag.setAttribute("download", filename);
  document.body.appendChild(downloadButtonAnchorTag);
  downloadButtonAnchorTag.click();
  downloadButtonAnchorTag.remove();
}

export function downloadAsCSV() {
  const csvArray = getCSV()
  const csvContent = "data:text/csv;charset=utf-8," + csvArray.map(e => e.join(",")).join("\n");
  const encodedURI = encodeURI(csvContent)
  downloadFile('report.csv', encodedURI)
}

export function downloadAsJson() {
  let downloadableContent = {}
  for (const key in networkStorage) {
    if (!isDownloadableRow(key)) continue
    downloadableContent[key] = networkStorage[key]
  }
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadableContent));
  downloadFile('report.json', dataStr)
}


export function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector('.styled-table');
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if ((n == 1 || n == 2 || n == 3 || n == 4) && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
          shouldSwitch = true;
          break;
        }
        if ((n == 0 || n == 5) && (Number(x.innerHTML) > Number(y.innerHTML))) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if ((n == 1 || n == 2 || n == 3 || n == 4) && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
          shouldSwitch = true;
          break;
        }
        if ((n == 0 || n == 5) && (Number(x.innerHTML) < Number(y.innerHTML))) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function isValidRequest(showAllRequests, url) {
  return (showAllRequests || isJSURL(url))
}

function isValidScript(showAllScripts, hostname) {
  return (showAllScripts || hostname.indexOf(currentHost) === -1)
}

export function showRequests(requestType, scriptType) {
  let rows = document.querySelector('.styled-table').rows
  let showAllRequests = requestType === 'All'
  let showAllScripts = scriptType === 'All'

  for (let i = 1; i < rows.length; i++) {
    let url = rows[i].children[1].innerText
    let hostname = new URL(url).hostname
    if (isValidRequest(showAllRequests, url) && isValidScript(showAllScripts, hostname)) {
      rows[i].style.display = ''
    }
    else {
      rows[i].style.display = 'none'
    }
  }
}

export function handleSearchInput() {
  let searchInput = document.getElementById('search-bar');
  let scriptType = document.getElementById('scriptType');
  let requestType = document.getElementById('requestType');
  scriptType.value = "All";
  requestType.value = "All";
  let searchValue = searchInput.value.toLowerCase()
  let rows = document.querySelector('.styled-table').rows
  for (let i = 1; i < rows.length; i++) {
    let url = rows[i].children[1].innerText
    let hostname = new URL(url).hostname
    if (url.toLowerCase().indexOf(searchValue) !== -1 || hostname.toLowerCase().indexOf(searchValue) !== -1) {
      rows[i].style.display = ''
    }
    else {
      rows[i].style.display = 'none'
    }
  }
}