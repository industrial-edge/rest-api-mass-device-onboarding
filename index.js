const axios = require("axios").default;
const fs = require('fs');
const FormData = require('form-data');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const IEM_URL = 'https://192.168.1.107:9443';

/*
axios.post(IEM_URL+'/portal/api/v1/login/direct', {
    "username": "pavel.halama@siemens.com",
    "password": "Edge4SUP!"
  })
  .then((response) => {
    TOKEN = response.data.data.access_token;
    console.log(typeof response.data.data);
    return TOKEN
    //console.log(TOKEN);
  })
  .then( token => {
      TOKEN = token;
    axios({
        method: 'post', //you can set what request you want to be
        url: IEM_URL+'/portal/api/v1/devices',
        data: {
                "device": {
                  "onboarding": {
                    "localUserName": "pavel.halama@siemens.com",
                    "localPassword": "Edge4SUP!",
                    "deviceName": "mydevice"
                  },
                  "Device": {
                    "Network": {
                      "Interfaces": [
                        {
                          "MacAddress": "00:0C:29:EA:B9:30",
                          "GatewayInterface": true,
                          "DHCP": "disabled",
                          "Static": {
                              "IPv4": "192.168.1.96",
                              "NetMask": "255.255.255.0",
                              "Gateway": "192.168.1.1"
                          },
                          "DNSConfig": {
                            "PrimaryDNS": "192.168.1.1",
                            "SecondaryDNS": "8.8.8.8"
                          }
                        },
                        {
                          "MacAddress": "00:0C:29:EA:B9:31",
                          "GatewayInterface": false,
                          "DHCP": "enabled",
                          "Static": {
                              "IPv4": "",
                              "NetMask": "",
                              "Gateway": ""
                          },
                          "DNSConfig": {
                            "PrimaryDNS": "",
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
    .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
    });
  })
  .catch((error) => {
    console.log(error);
});

*/

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
      data: {
              "device": {
                "onboarding": {
                  "localUserName": "pavel.halama@siemens.com",
                  "localPassword": "Edge4SUP!",
                  "deviceName": "mydevice"
                },
                "Device": {
                  "Network": {
                    "Interfaces": [
                      {
                        "MacAddress": "00:0C:29:FC:EA:3E",
                        "GatewayInterface": true,
                        "DHCP": "enabled",
                        "Static": {
                            "IPv4": "",
                            "NetMask": "",
                            "Gateway": ""
                        },
                        "DNSConfig": {
                          "PrimaryDNS": "",
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

  const resp_onboard = await axios.post('https://192.168.1.108/device/edge/b.service/api/v1/activate', form, {
    headers: form.getHeaders(),
  });

  console.log(resp_onboard);


  } catch (error) {
    console.log(error);
  }

};

onboardEdgeDevice();