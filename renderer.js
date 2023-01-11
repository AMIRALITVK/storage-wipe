const DevMode = true;
const { remote, ipcRenderer } = require("electron");
const { BrowserWindow } = require("electron/main");
const si = require("systeminformation");
const check = document.getElementById("checkCpu");
let devices_item = document.getElementById("devices");
// const log = document.getElementById("log");
let devices = [];
// const win = remote.getCurrentWindow();

const data_size = (bytes) => {
  console.log(Math.floor(bytes / 10 ** 9));
  return Math.floor(bytes / 10 ** 9);
};

const add_device = (data) => {
  if (data.type == "Unspecified") {
    img = "ssd";
  } else {
    img = data.type;
  }
  data.name = data.name.toUpperCase();
  if (data.type == "Unspecified") {
    data.type = "EXTERNAL";
  }

  const item = document.createElement("div");
  item.className = "device";
  item.setAttribute("id", data.id);
  item.innerHTML = `
    <img class="device_icon" src="./src/${img}.png" alt="" />
    <caption>
      <p class="captions" id="device_type">${data.type}</p>
      <p class="text-info" id="device_name">${data.name}</p>
      <p class="text-light" id="device_space">Total Space: ${data.size}</p>
      <p class="text-light" id="device_status">Smart Status: ${data.smartStatus}</p>
    </caption>`;

  devices_item.appendChild(item);
  console.log("Scanned Sucessfully!");
  return item;
};

// const device = document.getElementById('0');
// device.addEventListener('click', () => {
//   console.log('hi')
//   show_details();
// })

const show_details = (data) => {
  const device_info = document.getElementById("device_info");
  const info = document.createElement("div");
  device_info.style.display = "block";
  info.className = "infos";
  info.innerHTML = `
    <ul>
      <li>Name: ${data.name}</li>
      <li>Name: ${data.type}</li>
      <li>Total Space: ${data.size}</li>
      <li>Free Space: ${data.size}</li>
      <li>Smart Status: ${data.smartStatus}</li>
    </ul>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    `;
};



check.addEventListener("click", async () => {
  const a = document.getElementsByClassName("device");
  console.log(a.length);
  for (let i = 0; i < a.length; i + 2) {
    console.log("i", i);
    a[i].remove();
  }
  console.log("Scanning...");
  si.diskLayout()
    .then((data) => {
      devices = data;
      console.log(devices);
      return devices;
    })
    .then((devices) => {
      for (let i = 0; i < devices.length; i++) {
        _myDevice = devices[i];
        _myDevice.id = i;
        diskName = _myDevice.name;
        _myDevice.size = data_size(_myDevice.size);
        freeSpace = null;
        console.log(
          _myDevice.name,
          _myDevice.size,
          _myDevice.smartStatus,
          _myDevice.temperature
        );
        add_device(_myDevice);
      }
    })
    .catch((error) => console.error(error));
});

// log.addEventListener("click", () => {});
