// bringing node packages 
const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
const xlsx = require('xlsx');

// Enviroment Variables 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const IEM_URL = 'https://192.168.1.107:9443';

// Reading excel list as .xlsx file 
const file = xlsx.readFile('./devices/edge_devices_v0.0.1.xlsx');
console.log('File succesfully read...');

const sheets = file.SheetNames;
console.log(sheets);
let data = [];
for(let i = 0; i < sheets.length; i++){
   const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
   temp.forEach((res) => {
      data.push(res)
   })
}
  
// Printing data
console.log(data)

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