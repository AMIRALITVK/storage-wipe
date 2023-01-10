const DevMode = true;
const { remote, ipcRenderer } = require("electron");
const si = require('systeminformation');
const hdd = {
  divClass: "device",
  image: {
    src: "./src/hdd.png",
    class: "device_icon"
  },
  
    

}

const check = document.getElementById('checkCpu');
console.log('hello world');
check.addEventListener('click', () => {
  si.diskLayout()
    .then(data => console.log(data))
    .catch(error => console.error(error));
})