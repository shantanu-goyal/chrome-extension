let { networkStorage, currentUrl, performance } = JSON.parse(localStorage.getItem('networkStorage'));
import { thirdPartyWeb } from '../third-party-web/entity-finder-api.js'
let mainDocumentEntity = thirdPartyWeb.getEntity(currentUrl);
/**
 * Checks whether a url is third Party with respect to current domain
 * @param {string} url 
 * @returns whether the url is third Party with respect to current domain
 */

let requestByDomain = {}
let currentDomain = new URL(currentUrl).hostname



function getSubDomains() {
  let currentSubDomain = currentDomain.split('.').slice(-2).join('.')
  return Object.keys(requestByDomain).filter(key => {

    return currentSubDomain === key.split('.').slice(-2).join('.')
  })
}

function getAverageRequestTime() {
  if (networkStorage.length === 0) return 0
  let sum = Object.keys(networkStorage).reduce(function (previous, key) {
    if (isNaN(networkStorage[key].duration)) return previous
    return previous + networkStorage[key].duration;
  }, 0);
  return sum / Object.keys(networkStorage).length;
}

function createRequestByDomain() {
  Object.keys(networkStorage).forEach((key) => {
    let domain = new URL(networkStorage[key].url).host
    if (domain in requestByDomain) return
    requestByDomain[domain] = Object.keys(networkStorage).reduce((previous, key) => {
      return new URL(networkStorage[key].url).host === domain ? previous + 1 : previous
    }, 0)
  })
}

function getSlowestRequestTime() {
  return Object.keys(networkStorage).reduce((previous, key) => {
    if (isNaN(networkStorage[key].duration)) return previous
    return Math.max(previous, networkStorage[key].duration)
  }, 0)
}



function isThirdParty(url) {
  const entity = thirdPartyWeb.getEntity(url);
  // If entity not in dataset
  if (!entity) return false;
  // Entities don't match then not third party
  if (entity === mainDocumentEntity) return false;
  return true;
}

function isDomainSpecific(url) {
  return !isThirdParty(url);
}

/**
  * Checks if the row in the table can be downloaded or not
  *
  * @param {Number} requestid
  * @return { Boolean }
  */
export function isDownloadableRow(requestId) {
  return document.querySelector(`[request-id='${requestId}']`).style.display !== 'none'
}


/**
  * Helper function to convert the javascript object into an array for parsing in CSV
  *
  * @return {Array}
  */
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

function getCSVData() {
  const csvArray = getCSV()
  const csvContent = "data:text/csv;charset=utf-8," + csvArray.map(e => e.join(",")).join("\n");
  const encodedURI = encodeURI(csvContent);
  return encodedURI
}
function getJSONData() {
  let downloadableContent = {}
  for (const key in networkStorage) {
    if (!isDownloadableRow(key)) continue
    downloadableContent[key] = networkStorage[key]
  }
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloadableContent));
  return dataStr;
}


export function downloadAsJson() {
  const dataStr = getJSONData();
  downloadFile('report.json', dataStr)
}


/**
 *  Function to download the CSV File
 *  
 *  It first converts the javaScript object into an array. Then it creates a CSV file and downloads it.
 * 
 **/
export function downloadAsCSV() {
  const dataStr = getCSVData();
  downloadFile('report.csv', dataStr);
}

/**
  * Utility function to download files
  *
  * We create a new anchor element and append it to the body. We call the anchor element and set the href  * attribute to the file url. We then click the anchor element to trigger the download. We then remove the * anchor element from the DOM.
  * 
  * @param {String} filename
  * @param {String} downloadURL
  */
function downloadFile(filename, downloadURL) {
  let downloadButtonAnchorTag = document.createElement('a')
  downloadButtonAnchorTag.setAttribute("href", downloadURL);
  downloadButtonAnchorTag.setAttribute("download", filename);
  document.body.appendChild(downloadButtonAnchorTag);
  downloadButtonAnchorTag.click();
  downloadButtonAnchorTag.remove();
}


function preview(dataStr) {
  var win = window.open();
  win.document.write('<iframe src="' + dataStr + '"frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

export function previewAsJSON() {
  preview(getJSONData());
}

/**
  * Function to sort the table based on the column index
  *
  * @param {Number} n
  */
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
        if ((n == 1 || n == 2 || n == 3 || n == 4 || n == 5) && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
          shouldSwitch = true;
          break;
        }
        if ((n == 0 || n == 6) && (Number(x.innerHTML) > Number(y.innerHTML))) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if ((n == 1 || n == 2 || n == 3 || n == 4 || n == 5) && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
          shouldSwitch = true;
          break;
        }
        if ((n == 0 || n == 6) && (Number(x.innerHTML) < Number(y.innerHTML))) {
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
  recolourTable();
}



/**Function to show/hide the network requests based on the type of request ie. script or other
 * 
 * @param {Boolean} showAllRequests
 * @param {String} hostname
 * @return {Boolean}
 */
function isValidRequest(showAllRequests, row) {
  return (showAllRequests || row.children[2].innerText === 'script')
}

/**Function to show/hide the scripts based on the hostname
 * 
 * @param {Boolean} showAllScripts
 * @param {String} url
 * @return {Boolean}
 */
function isValidScript(showAllScripts, url, scriptType) {
  if (scriptType === 'Domain Specific') {
    return (showAllScripts || isDomainSpecific(url));
  }
  else {
    return (showAllScripts || isThirdParty(url))
  }

}


/**
 * 
 * Function to update the table based on the filters
 * 
 * @param {String} requestType 
 * @param {String} scriptType 
 * @param {String*} searchValue 
 */

export function showRequests(requestType, scriptType, searchValue) {
  let rows = document.querySelector('.styled-table').rows
  let showAllRequests = requestType === 'All'
  let showAllScripts = scriptType === 'All'
  for (let i = 1; i < rows.length; i++) {
    let url = rows[i].children[1].innerText
    if (isValidRequest(showAllRequests, rows[i]) && isValidScript(showAllScripts, url, scriptType) && url.toLowerCase().indexOf(searchValue) !== -1) {
      rows[i].style.display = ''
    }
    else {
      rows[i].style.display = 'none'
    }
  }
  recolourTable();
}


/**
 * Rounds off the number to 2 decimal places
 * 
 * @param {Number} value 
 * @returns {Number}
 */
export function round(value) {
  return Math.round(value * 100) / 100;
}


function recolourTable() {
  let color1 = "#f3f3f3";
  let switchColor = 0;
  let rows = document.querySelector('.styled-table').rows;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].style.display === '') {
      rows[i].style.backgroundColor = switchColor ? color1 : "transparent";
      switchColor = !switchColor;
    }
  }
}


export function renderHeaders() {
  let perfEntries = performance;
  console.log(perfEntries);
  let requestCount = document.querySelector('#requestCount');
  requestCount.querySelector('.block-value').innerHTML = Object.keys(networkStorage).length
  let domainCount = document.querySelector('#domainCount')
  createRequestByDomain()
  domainCount.querySelector('.block-value').innerHTML = Object.keys(requestByDomain).length
  let subDomainCount = document.querySelector('#subDomainCount')
  let subDomains = getSubDomains()
  subDomainCount.querySelector('.block-value').innerHTML = subDomains.length - 1
  let hostRequests = document.querySelector('#hostRequests')
  hostRequests.querySelector('.block-value').innerHTML = requestByDomain[currentDomain]
  let subDomainRequests = document.querySelector('#subDomainRequests')
  subDomainRequests.querySelector('.block-value').innerHTML = subDomains.reduce((previous, subDomain) => {
    return previous + requestByDomain[subDomain]
  }, 0)
  let totalTime = document.querySelector('#totalTime')
  totalTime.querySelector('.block-value').innerHTML = round(perfEntries.loadEventEnd - perfEntries.navigationStart) + ' ms'
  let firstByte = document.querySelector('#firstByte')
  firstByte.querySelector('.block-value').innerHTML = round(perfEntries.responseStart - perfEntries.navigationStart) + ' ms'
  let contentLoadTime = document.querySelector('#contentLoadTime')
  contentLoadTime.querySelector('.block-value').innerHTML = round(perfEntries.domContentLoadedEventStart - perfEntries.domLoading) + 'ms'
  let processTime = document.querySelector('#processTime')
  processTime.querySelector('.block-value').innerHTML = round(perfEntries.domComplete - perfEntries.domLoading) + 'ms'
  let slowestRequest = document.querySelector('#slowestRequest')
  slowestRequest.querySelector('.block-value').innerHTML = round(getSlowestRequestTime()) + 'ms'
  let avgRequestTime = document.querySelector('#avgRequestTime')
  avgRequestTime.querySelector('.block-value').innerHTML = round(getAverageRequestTime()) + 'ms'
} 