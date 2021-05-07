// TODO: 
// - ADD input validation 

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
      map.set(keys[index-1], Object.values(deviceConfigObj)[index].toString().trim());
    }
  
    return Object.fromEntries(map);
  };

  
const createNetworkConfig = (networkConfigObj, layer2ConfigObj) => {
    //console.log(networkConfigObj["NUMBER OF INTERFACES*"]);
/*
TODO: 
- [x] read and add L2 configuration!!!

*/
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
        map.set(keys[i-3], Object.values(networkConfigObj)[i].toString().split(',')[j].trim());
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
  
    // DNS configuration 
    let primary_dns = networkConfigObj["PRIMARY DNS*"].toString().split(',');
    let secondary_dns = networkConfigObj["SECONDARY DNS*"].toString().split(',');
  
    let primary_ind = [];
    let primary_true_count = 0; 
    let secondary_ind = [];
    let secondary_true_count = 0; 
  
    for (let i = 0; i < secondary_dns.length; i++) {
      var dns_config = {
        "PrimaryDNS": "",
        "SecondaryDNS": ""
      };
      Object.assign(interfaces[i],{"DNSConfig" : dns_config})
  
      if (secondary_dns[i].toString().trim()  == "true") {
        secondary_ind.push(i);
        secondary_true_count++; 
      }
      if (primary_dns[i].toString().trim() == "true") {
        primary_ind.push(i);
        primary_true_count++; 
      }
      
    };
      
  
    let primary_dns_ip = networkConfigObj["PRIMARY DNS IP*"].toString().split(',');
    let secondary_dns_ip = networkConfigObj["SECONDARY DNS IP*"].toString().split(',');
  
  
    for (let j = 0 ; j < primary_true_count; j++) {
      interfaces[primary_ind[j]]["DNSConfig"]["PrimaryDNS"] = primary_dns_ip[j].toString();
    };
    for (let j = 0 ; j < secondary_true_count; j++) {
      interfaces[secondary_ind[j]]["DNSConfig"]["SecondaryDNS"] = secondary_dns_ip[j].toString();
    };

    // L2 Configuration
    let layer2_config = networkConfigObj["L2 ACESS*"].toString().trim().split(',');

    var layer2_conf = {
      "StartingAddressIPv4": "",
      "NetMask": "",
      "Range": ""
    };

    let index = layer2_config.findIndex((element)=> {
      return element.trim()=="true"
    });
    if (index != -1) {
      layer2_conf.StartingAddressIPv4 = layer2ConfigObj["STARTING IP ADRESS"]
      layer2_conf.NetMask = layer2ConfigObj["NETWORK MASK"]
      layer2_conf.Range = layer2ConfigObj["RANGE"].toString()
      Object.assign(interfaces[index],{"L2Conf" : layer2_conf})
    }
    console.log(interfaces);

  return interfaces; 
};
  
const createConfig = (deviceConfigObj,networkConfigObj, layer2ConfigObj) => {
  /*
  TODO: 
  - dockerIP 
  - NTP servers 
  - Proxy servers 
  */
  return {
    "device": {
        "onboarding": createOnboardingConfig(deviceConfigObj),
        "Device": {
            "Network": {
                "Interfaces": createNetworkConfig(networkConfigObj,layer2ConfigObj)
            },
            "dockerIP": "172.16.0.0/16"
        },
        "ntpServers": [
            {
                "ntpServer": "time.google.com"
            },
            {
                "ntpServer": "0.pool.ntp.org"
            }
        ],
        "proxies": [
            {
                "host": "192.168.80.144:3128",
                "protocol": "http",
                "noProxy": "192.168.1.107",
                "customPorts": [
                    1234,
                    5478
                ]
            }
        ]
    }
  }
};



exports.createConfig = createConfig; 

