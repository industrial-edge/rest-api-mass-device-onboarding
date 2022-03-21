// Bringing node packages 
const axios = require("axios").default;
const fs = require('fs').promises;
const fss = require('fs');
const FormData = require('form-data');
const xlsx = require('xlsx');
const handler = require('./config_file_handler.js')

// Enviroment Variables for insecure connection - do this in trusted environment only! 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Reading excel list as .xlsx file with configured edge devices to be onboarded
console.log("Reading excel file with configured edge devices.");
const file = xlsx.readFile('./devices/edge_devices.xlsx');
console.log('File succesfully read.');
const sheets = file.SheetNames;

// IEM Config
const iem_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
// Device Config
const device_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[1]]);
// Network config
const network_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[2]]);
// Layer 2 Config
const layer2_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[3]]);
// Docker IP Config
const dockerIP_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[4]]);
// NTP Config
const ntp_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[5]]);
// PROXY Config
const proxy_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[6]]);

// IEM configuration variables
const IEM_URL = iem_config[0]["IEM URL*"].toString();
const IEM_USERNAME = iem_config[0]["IEM USERNAME*"].toString();
const IEM_PASSWORD = iem_config[0]["IEM PASSWORD*"].toString();


// Creating Configuration Files for all devices to be onboarded
console.log("Creating configuration files for onboarding of edge devices.");
let devicesConfFiles = [];
for (let j = 0; j < device_config.length; j++) {
  devicesConfFiles.push(handler.createConfig(device_config[j], network_config[j], layer2_config[j], dockerIP_config[j], ntp_config[j], proxy_config[j]))
}
console.log("Configuration files created.");

// Function to get getaway IP address of onboarded device
const getOnboardedDeviceIP = (interfaces, deviceIP) => {
  let result;
  for (let j = 0; j < interfaces.length; j++) {
    let gatewayInterface = interfaces[j].GatewayInterface;
    if (gatewayInterface.toString().trim() == "true") {
      if (interfaces[j].DHCP.toString().trim() == "disabled") {
        result = interfaces[j].Static.IPv4.toString().trim();
      } else {
        result = deviceIP;
      }
    }

  }

  return result;
};

// Timeout promise 
function timeoutPromise(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve("done");
    }, interval);
  });
};

// Async function for activating edge device in IEM based on configuration in excel file
let token;
const onboardEdgeDevice = async (configFile, deviceIP) => {

  //------------------------------------- LOGGING TO IEM ---------------------------------------------------------------
  console.log("Logging to IEM.");
  let device_file = configFile.device.onboarding.deviceName;
  try {
    const resp_login = await axios.post(IEM_URL + '/portal/api/v1/login/direct', {
      "username": IEM_USERNAME,
      "password": IEM_PASSWORD
    });

    token = resp_login.data.data.access_token;

    //------------------------------------- CREATING EDGE DEVICE IN IEM---------------------------------------------------------------
    console.log("Creating Edge Device with name " + device_file + " in IEM.");
    const resp_create = await axios({
      method: 'post', //you can set what request you want to be
      url: IEM_URL + '/portal/api/v1/devices',
      data: configFile,
      headers: {
        Authorization: 'BEARER ' + token,
        'Content-Type': 'application/json'
      }
    })

    // Save response as onboarding file in ./config_file folder
    try {
      await fs.writeFile(`./config_file/${device_file}.txt`, JSON.stringify(resp_create.data)); // need to be in an async function
      console.log("Edge device onboarding file saved!"); // the contents of file1.js
    } catch (error) {
      console.log(error)
    }

    //------------------------------------- ONBOARDING EDGE DEVICE ---------------------------------------------------------------

    // cancel request if IP of the device changed - cannot get response back
    const CancelToken = axios.CancelToken;
    let cancel;
    //console.log("Device IP changed? => " + handler.isDeviceIPChanged(configFile.device.Device.Network.Interfaces, deviceIP));
    console.log("Device IP changed? => " + (getOnboardedDeviceIP(configFile.device.Device.Network.Interfaces, deviceIP) != deviceIP));
    if ((getOnboardedDeviceIP(configFile.device.Device.Network.Interfaces, deviceIP) != deviceIP)) {
      setTimeout(() => {
        cancel();
      }, 1 * 10 * 1000);
    }

    // Get onboarding file of the device
    const form = new FormData();
    form.append('files', fss.createReadStream(`./config_file/${device_file}.txt`), `${device_file}.txt`);

    // Request for activating edge device in IEM using onboarding file 
    const resp_onboard = await axios.post('https://' + deviceIP + '/device/edge/api/v1/activate', form, {
      headers: form.getHeaders(),
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    });


    // Check if response status code is 200
    if (resp_onboard && resp_onboard.status == '204') {
      console.log("Device with name " + device_file + " activated in IEM.");
    }

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request cancelled because IP Address of edge device with name " + device_file + " changed.");
    } else {
      console.log(error);
    }

  }


};

// Async function for creating report of which devices successfully onboarded. The report is created in the same excel file in sheet called "REPORT"
const reportEdgeDevice = async (configFile, deviceIP, ws, id) => {
  //------------------------------------- CREATING REPORT ---------------------------------------------------------------

  // get current sheet data
  const before = xlsx.utils.sheet_to_json(ws);
  let device_file_name = configFile.device.onboarding.deviceName;

  let onboardedDeviceIP = getOnboardedDeviceIP(configFile.device.Device.Network.Interfaces, deviceIP)
  try {
    const CancelToken = axios.CancelToken;
    let cancel;
    setTimeout(() => {
      cancel();
    }, 1 * 10 * 1000);

    // Request for login to onboarded edge device 
    const resp_login_device = await axios.post('https://' + onboardedDeviceIP + '/device/edge/api/v1/login/direct', {
      "username": configFile.device.onboarding.localUserName,
      "password": configFile.device.onboarding.localPassword
    }, {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    });

    // Check if the response is correct and based on that create and write report to the excel file. 
    if (resp_login_device.status == '200') {
      console.log("Device with name " + device_file_name + " onboarded with this IP Address: " + onboardedDeviceIP);
      let v = { ID: id + 1, ONBOARDED: "Yes" }
      before.push(v)


    } else {
      console.log("Request failed with status code: " + resp_login_device.status + " The " + device_file_name + " may not be onboarded successfully.");
      let v = { ID: id + 1, ONBOARDED: "No" }
      before.push(v)
    }

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request cancelled because something went wrong during onboarding of edge device " + device_file_name);
    } else {
      console.log(error);
    }
    let v = { ID: id + 1, ONBOARDED: "No" }
    before.push(v)
  }
  // Add data to the sheet
  xlsx.utils.sheet_add_json(ws, before)
}

// Async function for onboarding of edge device
const onboardOneByOne = async () => {
  for (let i = 0; i < devicesConfFiles.length; i++) {
    await onboardEdgeDevice(devicesConfFiles[i], network_config[i]["IP ADRESS*"]);

  }
};

// Async function for reporting of edge device
const reportOneByOne = async (file, ws) => {
  for (let i = 0; i < devicesConfFiles.length; i++) {
    await reportEdgeDevice(devicesConfFiles[i], network_config[i]["IP ADRESS*"], ws, i);
    xlsx.writeFile(file, './devices/report.xlsx');
  }
};

// Main async function which controls calling of the functions above.
const onboardAndReportEdgeDevices = async (file, ws) => {
  console.log("---------------------- Start of device onboarding and activating. ----------------------");
  await onboardOneByOne();
  console.log("---------------------- Waiting for the devices to get activated ----------------------");
  const resolved = await timeoutPromise(60000)
  console.log("Waiting ended: " + resolved);
  console.log("---------------------- Start creating report of onboarded edge devices ----------------------");
  await reportOneByOne(file, ws);
  console.log("---------------------- End of the process of onboarding and reporting ----------------------");
}

// Worksheet for REPORT
const ws_name = "REPORT"
let data = []
const wb = xlsx.utils.book_new();
var ws = xlsx.utils.aoa_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, ws_name);

// Call main function
onboardAndReportEdgeDevices(wb, ws)

