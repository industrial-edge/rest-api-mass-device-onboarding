// TODO: 
// - [] ADD input validation 

// Device configuration 
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

// Network configuration
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
      if (dhcp[j].toString().trim() == "disabled") {
        const map = new Map();
        let keys = Object.keys(static)
        for (let i = 6; i <= 8; i++) {
          map.set(keys[i-6], Object.values(networkConfigObj)[i].toString().split(',')[j].trim());
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
      
    if (primary_true_count > 0) {
      let primary_dns_ip = networkConfigObj["PRIMARY DNS IP*"].toString().split(',');
      for (let j = 0 ; j < primary_true_count; j++) {
        interfaces[primary_ind[j]]["DNSConfig"]["PrimaryDNS"] = primary_dns_ip[j].toString();
      };
    }
      
    if (secondary_true_count > 0) {
      let secondary_dns_ip = networkConfigObj["SECONDARY DNS IP*"].toString().split(',');
      for (let j = 0 ; j < secondary_true_count; j++) {
        interfaces[secondary_ind[j]]["DNSConfig"]["SecondaryDNS"] = secondary_dns_ip[j].toString();
      };
    }

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


  return interfaces; 
};

// Docker IP configuration
const createDockerIPConfig = (dockerIPConfigObj) => {
  let dockerIP; 
  if (dockerIPConfigObj["DOCKER IP"]) {
    dockerIP = dockerIPConfigObj["DOCKER IP"].toString().trim();
  } else {
    dockerIP = "";
  }
  return dockerIP;
};

// NTP configuration

const createNTPConfig = (NTPConfigObj) => {
  /*
  TODO: 
  [] Add preffered configuration - true/false
  [] If not NTP configured -> then no "ntpServers" section
  */
  let NTP = [];
  if (NTPConfigObj["NTP SERVER"]) {
    let servers = NTPConfigObj["NTP SERVER"].split(',');
    for (let j = 0; j < servers.length; j++) {
      let obj = { "ntpServer": servers[j].toString().trim()};
      NTP.push(obj);
    }
  } else {
    let obj = { "ntpServer": ""};
      NTP.push(obj);
  }
  return NTP;
};
  
// Proxy configuration 

const createProxyConfig = (proxyConfigObj) => {
  var proxy = {
      "host": "",
      "protocol": "http",
      "user": "",
      "password": "",
      "noProxy": "",
      "customPorts": [
      ]
  };

  if (proxyConfigObj["HOST"]) {
    proxy.host = proxyConfigObj["HOST"].toString().trim();
    proxy.protocol= proxyConfigObj["PROTOCOL"].toString().trim();
    if (proxyConfigObj["USER"]) {
      proxy.user= proxyConfigObj["USER"].toString().trim();
      proxy.password= proxyConfigObj["PASSWORD"].toString().trim();
    }
    if (proxyConfigObj["NO PROXY"]) {
      proxy.noProxy= proxyConfigObj["NO PROXY"].toString().trim();
    }
    let ports = proxyConfigObj["CUSTOM PORTS"].split(',');
    for (let j = 0; j < ports.length; j++) {
      ports[j]= ports[j].toString().trim();
    }
    if (ports.length != 0) {
      proxy.customPorts = ports;
    }
    return proxy
  } else {
    return null
  }
  
};



const createConfig = (deviceConfigObj,networkConfigObj, layer2ConfigObj, dockerIPConfigObj, NTPConfigObj,proxyConfigObj) => {
  /*
  TODO: 
  - [x] dockerIP 
  - [x] NTP servers 
  - [x] Proxy servers 
  */
  var obj =  {
    "device": {
        "onboarding": createOnboardingConfig(deviceConfigObj),
        "Device": {
            "Network": {
                "Interfaces": createNetworkConfig(networkConfigObj,layer2ConfigObj)
            },
            "dockerIP": createDockerIPConfig(dockerIPConfigObj)
        },
        "ntpServers": createNTPConfig(NTPConfigObj)
    }
  }

  if (createProxyConfig(proxyConfigObj) != null) {
    obj.device.proxies = [createProxyConfig(proxyConfigObj)];
  }

  return obj

};



exports.createConfig = createConfig; 
exports.createProxyConfig= createProxyConfig;
