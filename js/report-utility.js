let { networkStorage, currentTab, currentUrl } = JSON.parse(localStorage.getItem('networkStorage'));
import {thirdPartyWeb} from '../third-party-web/entity-finder-api.js'
let mainDocumentEntity = thirdPartyWeb.getEntity(currentUrl)
console.log(currentUrl,mainDocumentEntity)

function isJSURL(url) {
  let pathname = new URL(url).pathname
  return /(\/|\.)js$/.test(pathname)
}

function isThirdParty(url) {
  const entity = thirdPartyWeb.getEntity(url);
  if (!entity) return false;
  console.log(url, entity)
  if (entity === mainDocumentEntity) return false;
  return true;
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

function isValidScript(showAllScripts, url) {
  return (showAllScripts || isThirdParty(url))
}


export function showRequests(requestType, scriptType, searchValue) {
  let rows = document.querySelector('.styled-table').rows
  let showAllRequests = requestType === 'All'
  let showAllScripts = scriptType === 'All'
  for (let i = 1; i < rows.length; i++) {
    let url = rows[i].children[1].innerText
    if (isValidRequest(showAllRequests, url) && isValidScript(showAllScripts, url) && url.toLowerCase().indexOf(searchValue) !== -1) {
      rows[i].style.display = ''
    }
    else {
      rows[i].style.display = 'none'
    }
  }
}

export function round(value) {
  return Math.round(value * 100) / 100;
}
