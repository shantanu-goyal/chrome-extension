let networkStorage = {}
let currentTab;

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
    setCurrentTab
}