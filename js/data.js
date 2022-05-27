let networkStorage = {}
let currentTab;
let currentUrl;


function getCurrentUrl() {
    return currentUrl;
}

function setCurrentUrl(url) {
    currentUrl = url;
}

function getCurrentTab() {
    return currentTab
}

function setCurrentTab(tab) {
    currentTab = tab
}

function getNetworkStorage() {
    return networkStorage
}

function setNetworkStorage(storage) {
    networkStorage = storage
}

export {
    getNetworkStorage,
    getCurrentTab,
    setNetworkStorage,
    setCurrentTab,
    getCurrentUrl,
    setCurrentUrl
}