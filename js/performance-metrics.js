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
    request.innerHTML += ":<br> " + Math.abs(round(performance.responseStart - performance.requestStart));
    response.innerHTML += ":<br> " + Math.abs(round(performance.responseEnd - performance.responseStart));
    processing.innerHTML += ":<br> " + Math.abs(round(performance.domComplete - performance.domInteractive));
    onLoad.innerHTML += ":<br> " + Math.abs(round(performance.loadEventStart - performance.loadEventEnd));
    tcp.innerHTML += ":<br> " + Math.abs(round(performance.connectEnd - performance.connectStart));
    dns.innerHTML += ":<br> " + Math.abs(round(performance.domainLookupEnd - performance.domainLookupStart));
    appCache.innerHTML += ":<br> " + Math.abs(round(performance.fetchStart - performance.domainLookupStart));
    redirect.innerHTML += ":<br> " + Math.abs(round(performance.redirectEnd - performance.redirectStart));
    console.log(performance);
  }
}


renderPerformanceMetrics();
