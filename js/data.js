let networkStorage = {}
let currentTab;
let currentUrl;

// Helps to get the current url
function getCurrentUrl() {
    return currentUrl;
}

// Updates the current url
function setCurrentUrl(url) {
    currentUrl = url;
}

// Gets the current tab id
function getCurrentTab() {
    return currentTab
}

// Updates the current tab id
function setCurrentTab(tab) {
    currentTab = tab
}

// Gets the network storage
function getNetworkStorage() {
    return networkStorage
}

// Updates the network storage
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