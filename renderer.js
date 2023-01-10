const DevMode = true;
const { remote, ipcRenderer } = require("electron");
const si = require("systeminformation");
const check = document.getElementById("checkCpu");

const hdd = {
  divClass: "device",
  image: {
    src: "./src/hdd.png",
    class: "device_icon",
  },
  title: {
    text: "HDD",
    class: "captions",
  },
  diskInfo: {
    class: "text-info disk_name",
    diskName: "",
  },
  diskSpace: {
    class: "text-light disk_size",
    totalSpace: "250G",
    freeSpace: "110G",
  },
};

const ssd = {
  divClass: "device",
  image: {
    src: "./src/ssd.png",
    class: "device_icon",
  },
  title: {
    text: "SSD",
    class: "captions",
  },
  diskName: {
    class: "text-info disk_name",
  },
  diskSpace: {
    class: "text-light disk_size",
  },
};

const flash = {
  divClass: "device",
  image: {
    src: "./src/flash.png",
    class: "device_icon",
  },
  title: {
    text: "FLASHDRIVE",
    class: "captions",
  },
  diskName: {
    class: "text-info disk_name",
  },
  diskSpace: {
    class: "text-light disk_size",
  },
};

const dataSize = (bytes) => {
  console.log(Math.floor(bytes / 10 ** 9));
  return Math.floor(bytes / 10 ** 9);
};

let devices = {};


check.addEventListener("click", () => {
  console.log("Start Scan");
  si.diskLayout()
    .then((data) => {
      devices = data;
      console.log(devices);
      return devices;
    }
    ).then((devices) => {
      for(let i = 0; i < devices.length; i++) {
        console.log(devices[i].name, devices[i].smartStatus, devices[i].temperature);
        dataSize(devices[i].size);
      }
    })
    .catch((error) => console.error(error));
});