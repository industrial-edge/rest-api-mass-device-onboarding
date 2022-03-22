# Mass Edge Device onboarding

This documentation shows how to use provided application that can automatically onboard edge devices to IEM over public API.

- [Mass Edge Device onboarding](#mass-edge-device-onboarding)
  - [Installation steps](#installation-steps)
    - [Instalation setup](#instalation-setup)
    - [Build and deploy the application](#build-and-deploy-the-application)
    - [Access the application and start the onboarding process](#access-the-application-and-start-the-onboarding-process)

## Installation steps

The documentation below is describing how to setup and deploy an node.js application that runs on one edge device and onboards other edge devices. Note that the application can also run on a separate server with docker installed. To use provided docker based application and onboard your Edge devices, follow the provided steps.

### Instalation setup

1. Clone this repository to your Linux VM that has connection to your IEM.

2. Onboard first Edge device over IEM's user interface. 

3. Setup and connect your edge devices to your network which has access to the IEM and with a DHCP server available. At the end of this step, you should have the edge devices connected with a known IP addresses and ready to be activated. Your network configuration should be similar to [this](../README.md#application-runs-on-another-device)

4. Open the provided excel file and fill out the excel sheets divided based on different edge device configuration. Required fieds are marked with a "*" symbol. Each device should have a unique ID starting from 1. If you want to have no configuration of your edge device in a certain configuration sheet, leave the colomn empty, but the ID still **has** to be there.

5. Adjust your IEM credentials in the first sheet of the excel file.
6. Save your excel file.

### Build and deploy the application

7. Go to the [src](../src) folder and open up terminal. 
8. Build the docker application by running the following command.

``` bash
  docker-compose build
```

9.  Upload this application to IEM by using IE App Publisher. More information on how to upload an application to IEM can be found [here](https://github.com/industrial-edge/upload-app-to-industrial-edge-management).
  
10. Deploy your application to the first edge device.

### Access the application and start the onboarding process

11. Go to the device UI and access the application by clicking on its icon. Click on "upload file" and choose the excel file with configured edge devices. 
12. The process of onboarding then starts automatically. 
13. If none of the edge devices occur in IEM, download the app logs for more information. 