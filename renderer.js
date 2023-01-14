const DevMode = true;
const { remote, ipcRenderer } = require("electron");
const { BrowserWindow } = require("electron/renderer");
const si = require("systeminformation");
const { $ } = require("jquery");
const { PowerShell } = require("node-powershell/dist/PowerShell");
const cliProgress = require('cli-progress');
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// const exec = require("node:child-proccess");
// const log = document.getElementById("log");
// const win = remote.getCurrentWindow();
const scan = document.getElementById("check_storage");
let devices_item = document.getElementById("devices");
let devices = [];

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
      <p class="text-light" id="device_space">Total Space: ${data.size} GB</p>
      <p class="text-light" id="device_status">Smart Status: ${data.smartStatus}</p>
    </caption>`;

  devices_item.appendChild(item);
  console.log("Scanned Sucessfully!");
  document.getElementById(data.id).addEventListener("click", () => {
    show_details(data);
    document.getElementById("format").addEventListener("click", () => {
      // console.log("formatted");
      terminal("format", data);
      progressBar.stop();
    });
    document.getElementById("wipe").addEventListener("click", async () => {
      terminal("wipe", data);
    });
  });
  return item;
};

const show_details = (data) => {
  console.log(data);
  const device_info = document.getElementById("device_info");
  device_info.style.display = "flex";
  if (document.getElementById("infos")) {
    document.getElementById("infos").remove();
  }
  const info = document.createElement("div");
  info.setAttribute("id", "infos");
  info.innerHTML = `
    <ul>
      <li>Name: ${data.name}</li>
      <li>Type: ${data.type}</li>
      <li>Total Space: ${data.size} GB</li>
      <li>Free Space: ${data.size} GB</li>
      <li>Smart Status: ${data.smartStatus}</li>
    </ul>
    <button id="format">Quick Wipe</button>
    <button id="wipe">Nist Wipe</button>
    `;
  device_info.appendChild(info);
};

scan.addEventListener("click", async () => {
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
        console.log(_myDevice.id);
      }
    })
    .catch((error) => console.error(error));
});

let cm;
const terminal = async (command, data) => {
  const ps = new PowerShell({
    executionPolicy: "Bypass",
    noProfile: true,
  });
  if (command == "format") {
    try {
      console.log(data.id);
      console.log('Device Is Formatting...');
      progressBar.start(200, 0);
      cm = PowerShell.command`Clear-Disk -Number ${data.id} -RemoveData -RemoveOEM -AsJob -Confirm:$false; New-Partition -DiskNumber ${data.id} -AssignDriveLetter -UseMaximumSize | format-volume -filesystem NTFS -NewFileSystemLabel "New Volume" -confirm:$False`;

      // cm = PowerShell.command`ls`;

      const output = await ps.invoke(cm);
      progressBar.update(100);
      ps.dispose();
      // const result = JSON.parse(output.raw);
      console.log(output.raw.toString());
      console.log('Completely Formatted!');
      return output.raw.toString();
    } catch (e) {
      console.log(e);
    }
  } else if (command == "wipe") {
    console.log(data);
    console.log('Device Is Wipping...');
    cm = PowerShell.command`Clear-Disk -Number 2 -RemoveData -Confirm:$false; New-Partition -DiskNumber 2 -AssignDriveLetter -UseMaximumSize | set-partition -newdriveletter R; format R: /v:NewVolume /fs:NTFS /p:0 /y`;
    const output = await ps.invoke(cm);
    ps.dispose();
    // const result = JSON.parse(output.raw);
    console.log(output.raw.toString());
    console.log('Completely Wipped!');
    return output.raw.toString();
  }
};
