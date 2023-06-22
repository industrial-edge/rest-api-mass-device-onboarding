# Mass Edge Device onboarding

- [Mass Edge Device onboarding](#mass-edge-device-onboarding)
  - [Installation steps](#installation-steps)
    - [Download Repository](#download-repository)
    - [Instalation setup](#instalation-setup)
    - [Build docker image](#build-docker-image)
    - [Deploy the application](#deploy-the-application)
    - [Access the application and start the onboarding process](#access-the-application-and-start-the-onboarding-process)

## Installation steps

The document describes how to setup and deploy an node.js application that runs on one Edge Device and onboards other Edge Devices.

![MassOnboard](../docs/graphics/mass_onboard_device.PNG)

Apart from this solution note that the application can also run on a separate server with docker installed.

### Download Repository

Download or clone the repository source code to your workstation.  
![Github Clone Section](graphics/clonerepo.png)


* Trough terminal:
```bash
git clone https://github.com/industrial-edge/rest-api-mass-device-onboarding.git
```

* Trough VSCode:  
<kbd>CTRL</kbd>+<kbd>&uarr; SHIFT</kbd>+<kbd>P</kbd> or <kbd>F1</kbd> to open VSCode's command pallette and type `git clone`:

![VS Code Git Clone command](graphics/git.png)

### Instalation setup

1. Onboard first Edge device over IEM's user interface.

2. Setup and connect your edge devices to your network which has access to the IEM and with a DHCP server available. At the end of this step, you should have the edge devices connected with a known IP addresses and ready to be activated. Your network configuration should be similar to the illustration [above](#installation-steps).

3. Open the template [excel-file](../src/excel-file/edge_devices.xlsx) and fill out the excel sheets divided based on different edge device configuration. General rules: 
  * Required fieds are marked with a "\*" symbol. 
  * Each device should have a unique ID starting from 1. 
  * If you want to have no configuration of your edge device in a certain configuration sheet, leave the colomn empty, but the ID still **has** to be there in order for the application to work correctly.
  * **IP Adress, network mask and getaway adress are only needed if DHCP is disabled!**

4. Adjust your IEM credentials in the first sheet of the excel file.
5. Save your excel file.

### Build docker image

- Navigate into `src/onboard_device` and `src/upload_over_ui` and find the file named `Dockerfile.example`. The `Dockerfile.example` is an example Dockerfile that can be used to build the docker image(s) of the service(s) that runs in this application example. If you choose to use these, rename them to `Dockerfile` before proceeding
- Open a console in the `src` folder (where the `docker-compose` file is)
- Use the `docker compose build` (replaces the older `docker-compose build`) command to build the docker image of the service which is specified in the docker-compose.yml file.
- These Docker images can now be used to build your app with the Industrial Edge App Publisher
- `docker images` can be used to check for the images

### Deploy the application

1. Upload this application to IEM by using IE App Publisher. More information on how to upload an application to IEM can be found [here](https://github.com/industrial-edge/upload-app-to-industrial-edge-management).

2.  Deploy your application to the first edge device.

> **_NOTE:_** This document describes the use case of running the application on another Edge device. The application can also run on a separate server with docker installed.

### Access the application and start the onboarding process

3. Go to the device UI and access the application by clicking on its icon. Click on "Choose Files" and choose the excel file with configured edge devices.

![MassOnboard](../docs/graphics/upload-file.PNG)

4. Click "Submit" to upload the file to the application. If the file uploaded successfully, you will get a respective message. After this step the onboarding process starts automatically.

![MassOnboard](../docs/graphics/upload-file-success.PNG)

5. After this step the edge devices should start showing in IEM and get onboarded one after another. If there are no devices in IEM, check the application logs.

6. After the process ends the application stops. You can check the application volumes and download the `report.xlsx` file to see the report of which devices have been onboarded successfully and which not.

![MassOnboard](../docs/graphics/report.PNG)
