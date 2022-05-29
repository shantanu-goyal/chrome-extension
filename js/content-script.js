localStorage.setItem('flag',"false");

window.onload = () => {
    let windowPerformance = window.performance.getEntriesByName(window.location.href);
    localStorage.setItem('performance', JSON.stringify(windowPerformance));
    localStorage.setItem('flag',"true");
}