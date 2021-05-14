// bringing node packages 
const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const xlsx = require('xlsx');
const handler = require('./config_file_handler.js')

// Enviroment Variables 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const IEM_URL = 'https://192.168.1.107:9443';

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


console.log(handler.createConfig(device_config[0],network_config[0],layer2_config[0],dockerIP_config[0], ntp_config[0],proxy_config[0]).device.Device.Network.Interfaces[1]);

// API Calls
// Async/Await solution
let token; 
const onboardEdgeDevice = async () => {
//------------------------------------- LOGGING TO IEM ---------------------------------------------------------------
  console.log("Logging to IEM ...");
  try {
    const resp_login = await axios.post(IEM_URL+'/portal/api/v1/login/direct', {
      "username": "pavel.halama@siemens.com",
      "password": "Edge4SUP!"
    });

    token= resp_login.data.data.access_token;
    console.log(token);
//------------------------------------- CREATING EDGE DEVICE ---------------------------------------------------------------

    console.log("Creating Edge Device in IEM ...");
    const resp_create = await axios({
      method: 'post', //you can set what request you want to be
      url: IEM_URL+'/portal/api/v1/devices',
      data: handler.createConfig(device_config[0],network_config[0],layer2_config[0],dockerIP_config[0], ntp_config[0],proxy_config[0]),
      headers: {
        Authorization: 'BEARER ' + token,
        'Content-Type': 'application/json'
      }
  })

  console.log(resp_create.request.body);
// save response as config file 
  fs.writeFile('./config_file/device-config.txt', JSON.stringify(resp_create.data), (err) => {
  if (err) throw err;
  console.log('File saved!');
  });

//------------------------------------- ONBOARDING EDGE DEVICE ---------------------------------------------------------------

// create form data 
/*
TODO:
- [] IP adress of edge device in API url 
- [] Handle http request when static IP adress of device changes 
*/


  const form = new FormData();
  form.append( 'files', fs.createReadStream('./config_file/device-config.txt'), 'device-config.txt' );

  const resp_onboard = await axios.post('https://192.168.1.108/device/edge/api/v1/activate', form, {
    headers: form.getHeaders(),
  });

  console.log(resp_onboard);

  } catch (error) {
    console.log(error);
  }

};

onboardEdgeDevice();

