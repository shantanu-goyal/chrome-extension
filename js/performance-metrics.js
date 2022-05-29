import { round } from "./report-utility.js";

function renderPerformanceMetrics() {
  const promptForUnload = document.querySelector('#prompt-for-unload');
  const redirect = document.querySelector('#redirect');
  const appCache = document.querySelector('#app-cache');
  const dns = document.querySelector('#dns');
  const tcp = document.querySelector('#tcp');
  const request = document.querySelector('#request');
  const response = document.querySelector('#response');
  const processing = document.querySelector('#processing');
  const onLoad = document.querySelector('#on-load');
  let performance = JSON.parse(localStorage.getItem('performance'));
  if (performance.length > 0) {
    performance = performance[0];
    request.innerHTML = round(performance.requestStart) + "ms";
    response.innerHTML = round(performance.responseStart) + "ms";
    processing.innerHTML = round(performance.responseEnd) + "ms";
    onLoad.innerHTML = round(performance.loadEventStart) + "ms";
    tcp.innerHTML = round(performance.connectStart) + "ms";
    dns.innerHTML = round(performance.domainLookupStart) + "ms";
    appCache.innerHTML = round(performance.fetchStart) + "ms";
    redirect.innerHTML = round(performance.redirectStart) + "ms";
    console.log(performance);
  }
}


renderPerformanceMetrics();
