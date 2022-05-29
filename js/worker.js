function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function busyWait(){
    while(localStorage.getItem('flag')!=='true'){
        await sleep(100);
    }
    self.postMessage(true)
}