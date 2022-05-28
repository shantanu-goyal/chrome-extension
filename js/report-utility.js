export function downloadAsJson(){
  let {networkStorage} = JSON.parse(localStorage.getItem('networkStorage'));
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(networkStorage));
  let downloadButtonAnchorTag=document.createElement('a')
  downloadButtonAnchorTag.setAttribute("href",     dataStr);
  downloadButtonAnchorTag.setAttribute("download", "report.json");
  document.body.appendChild(downloadButtonAnchorTag);
  downloadButtonAnchorTag.click();
  downloadButtonAnchorTag.remove();
}


export function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table=document.querySelector('.styled-table');
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if ((n==1||n==2||n==3||n==4) && (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())) {
            shouldSwitch = true;
            break;
          }
          if ((n==0||n==5)&&(Number(x.innerHTML) > Number(y.innerHTML))) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if ((n==1||n==2||n==3||n==4) && (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())) {
            shouldSwitch = true;
            break;
          }
          if ((n==0||n==5)&&(Number(x.innerHTML) < Number(y.innerHTML))) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}
