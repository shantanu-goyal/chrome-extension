import { NETWORK_FILTERS } from "./constants.js";
import { getCurrentTab, setNetworkStorage, getNetworkStorage } from "./data.js";


/**
 * Event Handler 
 * 
 * Before Request Event is triggered when a request is about to be made, and before headers are available.
 * 
 * @param {Object} details 
 * @returns 
 */

function beforeRequestEventHandler(details) {
  const { tabId, url, timeStamp, requestId } = details;
  if (tabId !== getCurrentTab()) {
    return;
  }
  const networkStorage = getNetworkStorage()
  networkStorage[requestId] = {
    url,
    startTime: timeStamp,
    status: 'Pending'
  }
  setNetworkStorage(networkStorage)
}

/**
 * Event Handler 
 * 
 * Completed Request Event is triggered after a request is completed.
 * 
 * @param {Object} details 
 * @returns 
 */


function completedRequestHandler(details) {
  const { tabId, timeStamp, requestId, type } = details;
  if (tabId !== getCurrentTab()) {
    return;
  }
  const networkStorage = getNetworkStorage()
  let request = networkStorage[requestId]
  Object.assign(request, {
    endTime: timeStamp,
    duration: timeStamp - request.startTime,
    status: 'complete',
    type
  });
  setNetworkStorage(networkStorage)
}

/**
 * Event Handler 
 * 
 * Fired when a request could not be processed due to an error: for example, a lack of Internet
 * connectivity.
 * 
 * @param {Object} details 
 * @returns 
 */

function errorOccuredHandler(details) {
  const { tabId, requestId } = details;
  if (tabId !== getCurrentTab()) {
    return;
  }
  let networkStorage = getNetworkStorage()
  const request = networkStorage[requestId];
  Object.assign(request, {
    endTime: details.timeStamp,
    status: 'error',
  });
  setNetworkStorage(networkStorage)
}

chrome.webRequest.onBeforeRequest.addListener(beforeRequestEventHandler, NETWORK_FILTERS);
chrome.webRequest.onCompleted.addListener(completedRequestHandler, NETWORK_FILTERS);
chrome.webRequest.onErrorOccurred.addListener(errorOccuredHandler, NETWORK_FILTERS);