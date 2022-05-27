const colorChange = document.querySelector('#colorChange');
function handleButtonClick() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;
    chrome.tabs.create({
      url
    });
  });

}

colorChange.addEventListener('click', handleButtonClick);