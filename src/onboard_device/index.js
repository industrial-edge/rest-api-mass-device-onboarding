// bringing node packages 
const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const xlsx = require('xlsx');
const handler = require('./config_file_handler.js')

// Enviroment Variables 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ADJSUT THESE PARAMETERS !!!
const IEM_URL = 'https://192.168.1.90:9443';
const IEM_USERNAME = 'pavel.halama@siemens.com';
const IEM_PASSWORD = 'Edge4SUP!';
// 'https://192.168.1.107:9443';

console.log(IEM_URL);

// Reading excel list as .xlsx file 
const file = xlsx.readFile('./devices/edge_devices_v0.0.1.xlsx');
console.log('File succesfully read...');
const sheets = file.SheetNames;

// Device Config
const device_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
// Network config
const network_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[1]]);
// Layer 2 Config
const layer2_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[2]]);
// Docker IP Config
const dockerIP_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[3]]);
// NTP Config
const ntp_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[4]]);
// PROXY Config
const proxy_config = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[5]]);

// Printing data
//console.log(device_config[0]);
//console.log(typeof network_config[0]["MAC ADRESS*"]);

var adresses = network_config[0]["MAC ADRESS*"].split(',');

//console.log(layer2_config[0]);
// creating config files 
//console.log(handler.createConfig(device_config[1],network_config[1],layer2_config[1],dockerIP_config[1], ntp_config[1],proxy_config[1]));


// Creating COnfiguration Files for all devices 
let devicesConfFiles = [];
for (let j = 0; j < device_config.length; j++) {
  devicesConfFiles.push(handler.createConfig(device_config[j], network_config[j], layer2_config[j], dockerIP_config[j], ntp_config[j], proxy_config[j]))
}

console.log(devicesConfFiles);

// API Calls
// Async/Await solution

let token;
const onboardEdgeDevice = async (configFile, deviceIP) => {
  //------------------------------------- LOGGING TO IEM ---------------------------------------------------------------
  console.log("Logging to IEM ...");
  let device_file = configFile.device.onboarding.deviceName;
  try {
    const resp_login = await axios.post(IEM_URL + '/portal/api/v1/login/direct', {
      "username": IEM_USERNAME,
      "password": IEM_PASSWORD
    });

    token = resp_login.data.data.access_token;
    console.log(token);
    //------------------------------------- CREATING EDGE DEVICE ---------------------------------------------------------------

    console.log("Creating Edge Device in IEM ...");
    const resp_create = await axios({
      method: 'post', //you can set what request you want to be
      url: IEM_URL + '/portal/api/v1/devices',
      data: configFile,
      headers: {
        Authorization: 'BEARER ' + token,
        'Content-Type': 'application/json'
      }
    })

    console.log(resp_create.request.body);
    // save response as config file 
    fs.writeFile(`./config_file/${device_file}.txt`, JSON.stringify(resp_create.data), (err) => {
      if (err) throw err;
      console.log('File saved!');
    });

    //------------------------------------- ONBOARDING EDGE DEVICE ---------------------------------------------------------------

    // create form data 
    /*
    TODO:
    - [x] IP adress of edge device in API url 
    - [x] Handle http request when static IP adress of device changes 
        - [x] Check whether the IP adress of getaway adress changed 
              -> if not nothing happens 
              -> if yes wait for some time and cancel the request 
        
    */

    const CancelToken = axios.CancelToken;
    let cancel;
    console.log("Device changed? =>" + handler.isDeviceIPChanged(configFile.device.Device.Network.Interfaces, deviceIP));
    if (handler.isDeviceIPChanged(configFile.device.Device.Network.Interfaces, deviceIP)) {
      setTimeout(() => {
        cancel();
        console.log("Request cancelled...");
      }, 1 * 60 * 1000);
    }

    const form = new FormData();
    form.append('files', fs.createReadStream(`./config_file/${device_file}.txt`), `${device_file}.txt`);

    const resp_onboard = await axios.post('https://' + deviceIP + '/device/edge/api/v1/activate', form, {
      headers: form.getHeaders(),
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    });





    console.log(resp_onboard);

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request cancelled");
    } else {
      console.log(error);
    }

  }

};

for (let i = 0; i < devicesConfFiles.length; i++) {
  onboardEdgeDevice(devicesConfFiles[i], network_config[i]["IP ADRESS*"]);
}



