let { networkStorage, currentUrl } = JSON.parse(localStorage.getItem('networkStorage'));
import { thirdPartyWeb } from '../third-party-web/entity-finder-api.js'
let mainDocumentEntity = thirdPartyWeb.getEntity(currentUrl);

/**
  * Checks if the url is a javascript file or not
  * 
  * @param {String} url
  * @return {Boolean}
  */
function isJSURL(url) {
  let pathname = new URL(url).pathname
  return /(\/|\.)js$/.test(pathname)
}

function isThirdParty(url) {
  const entity = thirdPartyWeb.getEntity(url);
  if (!entity) return false;
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
  recolourTable();
}



/**Function to show/hide the network requests based on the type of request ie. script or other
 * 
 * @param {Boolean} showAllRequests
 * @param {String} hostname
 * @return {Boolean}
 */
function isValidRequest(showAllRequests, url) {
  return (showAllRequests || isJSURL(url))
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
    if (isValidRequest(showAllRequests, url) && isValidScript(showAllScripts, url, scriptType) && url.toLowerCase().indexOf(searchValue) !== -1) {
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
  let color2 = "#ffffff";
  let switchColor = 0;
  let rows = document.querySelector('.styled-table').rows;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].style.display === '') {
      rows[i].style.backgroundColor = switchColor ? color1 : color2;
      switchColor = !switchColor;
    }
  }
}