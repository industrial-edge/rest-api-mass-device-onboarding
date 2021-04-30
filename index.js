// bringing node packages 
const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const xlsx = require('xlsx');
const { isObject } = require("util");
const { join } = require("path");

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
//console.log(adresses);

// creating config files 

// device config sheet
const createOnboardingConfig = (deviceConfigObj) => {
  
  var obj = { 
    "localUserName": "", 
    "localPassword": "", 
    "deviceName": "", 
    "deviceTypeId": ""
  };
  const map = new Map();
  let keys = Object.keys(obj)
  for (let index = 1; index < Object.values(deviceConfigObj).length; index++) {
    map.set(keys[index-1], Object.values(deviceConfigObj)[index]);
  }

  return Object.fromEntries(map);
};

//console.log(createOnboardingConfig(device_config[0]))

// network config sheet

console.log(network_config[0]);

var object = {
  "MacAddress": "00:0C:29:FC:EA:3E",
  "GatewayInterface": true,
  "DHCP": "disabled",
  "Static": {
      "IPv4": "192.168.1.108",
      "NetMask": "255.255.255.0",
      "Gateway": "192.168.1.1"
  },
  "DNSConfig": {
    "PrimaryDNS": "192.168.1.1",
    "SecondaryDNS": "8.8.8.8"
  },
  "L2Conf": {
    "StartingAddressIPv4": "192.168.1.8",
    "NetMask": "255.255.255.0",
    "Range": "2"
  }
};

const createNetworkConfig = (networkConfigObj) => {
  //console.log(networkConfigObj["NUMBER OF INTERFACES*"]);
  let interfaces = []; 
  // basic network configuration 
  var basicNetwork = { 
    "MacAddress": "",
    "GatewayInterface": true,
    "DHCP": "",
  };

  for (let j = 0; j < networkConfigObj["NUMBER OF INTERFACES*"]; j++) {
    const map = new Map();
    let keys = Object.keys(basicNetwork)
    for (let i = 3; i <= 5; i++) {
      map.set(keys[i-3], Object.values(networkConfigObj)[i].toString().split(',')[j]);
    }
    interfaces.push(Object.fromEntries(map))
  }
  // DHCP configuration 
  var static = {
    "IPv4": "",
    "NetMask": "",
    "Gateway": ""
  }

  let dhcp = networkConfigObj["DHCP*"].toString().split(',');

  for (let j = 0; j < dhcp.length; j++) {
    if (dhcp[j]== "disabled") {
      const map = new Map();
      let keys = Object.keys(static)
      for (let i = 6; i <= 8; i++) {
        map.set(keys[i-6], Object.values(networkConfigObj)[i].toString().split(',')[j]);
      }
      Object.assign(interfaces[j],{"Static" : Object.fromEntries(map)})
    } else {
      Object.assign(interfaces[j],{"Static": static});
    };
  };
  return interfaces
};


console.log(createNetworkConfig(network_config[0]));



// Async/Await solution
/*
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
      data: {
              "device": {
                "onboarding": {
                  "localUserName": "pavel.halama@siemens.com",
                  "localPassword": "Edge4SUP!",
                  "deviceName": "staticdev"
                },
                "Device": {
                  "Network": {
                    "Interfaces": [
                      {
                        "MacAddress": "00:0C:29:EA:B9:21",
                        "GatewayInterface": true,
                        "DHCP": "disabled",
                        "Static": {
                            "IPv4": "192.168.1.104",
                            "NetMask": "255.255.255.0",
                            "Gateway": "192.168.1.1"
                        },
                        "DNSConfig": {
                          "PrimaryDNS": "192.168.1.1",
                          "SecondaryDNS": ""
                        }
                      }
                    ]
                  }
                },
                "ntpServer": [
                  {
                    "ntpServer": "0.pool.ntp.org"
                  }
                ]
              }
      },
      headers: {
        Authorization: 'BEARER ' + token,
        'Content-Type': 'application/json'
      }
  })

  console.log(resp_create.data);
// save response as config file 
  fs.writeFile('./config_file/device-config.txt', JSON.stringify(resp_create.data), (err) => {
  if (err) throw err;
  console.log('File saved!');
  });

//------------------------------------- ONBOARDING EDGE DEVICE ---------------------------------------------------------------
  
// create form data 
  const form = new FormData();
  form.append( 'files', fs.createReadStream('./config_file/device-config.txt'), 'device-config.txt' );

  const resp_onboard = await axios.post('https://192.168.1.104/device/edge/api/v1/activate', form, {
    headers: form.getHeaders(),
  });

  console.log(resp_onboard);


  } catch (error) {
    console.log(error);
  }

};

onboardEdgeDevice();

*/