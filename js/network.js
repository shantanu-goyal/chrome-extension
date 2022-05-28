import { NETWORK_FILTERS } from "./constants.js";
import { getCurrentTab, setNetworkStorage, getNetworkStorage} from "./data.js";

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
  console.clear()
  console.table(networkStorage, ['url', 'status','startTime', 'endTime','duration'])
  setNetworkStorage(networkStorage) 
}

function completedRequestHandler(details) { 
  const { tabId, timeStamp, requestId } = details;
  if (tabId !== getCurrentTab()) {
    return;
  }
  const networkStorage = getNetworkStorage()
  let request = networkStorage[requestId]
  Object.assign(request, {
    endTime: timeStamp,
    duration: timeStamp - request.startTime,
    status: 'complete',
  });
  // console.clear()
  // console.table(networkStorage, ['url', 'status','startTime', 'endTime', 'duration'])
  setNetworkStorage(networkStorage) 
}

function errorOccuredHandler(details){
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
  // console.clear()
  // console.table(networkStorage, ['url', 'status','startTime', 'endTime', 'duration'])
  setNetworkStorage(networkStorage) 
}

chrome.webRequest.onBeforeRequest.addListener(beforeRequestEventHandler, NETWORK_FILTERS);
chrome.webRequest.onCompleted.addListener(completedRequestHandler, NETWORK_FILTERS);
chrome.webRequest.onErrorOccurred.addListener(errorOccuredHandler, NETWORK_FILTERS);