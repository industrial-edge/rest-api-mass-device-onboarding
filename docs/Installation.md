# Mass Edge Device onboarding

This documentation shows how to use provided application that can automaticaly onboard edge devices to IEM over public API.

- [Mass Edge Device onboarding](#mass-edge-device-onboarding)
  - [Installation steps](#installation-steps)

## Installation steps

To use provided docker based application to onboard your edge devices, follow the provided steps.

1. Clone this repository to your Linux VM that has connection to your IEM.\
**_Pro Tip:_**  This application can be integrated into CI/CD pipeline that runs on a CI/CD server.

2. Onboard first Edge device over IEM's UI. 

3. Setup and connect your edge devices to your network which has acess to the IEM and with a DHCP server available. At the end of this step, you should have the edge devices connected with a know IP adresses and ready to be activated.

4. Open the provided [excel-file](../src/devices/edge_devices_v0.0.1.xlsx) and fill out the excel sheets devided based on different edge device configuration. Required fieds are marked with a "*" symbol. Each device should have a unique ID starting from 1. If you want to have no configuration of your edge device in a certain configuration sheet, leave the colomn empty, but the ID still **has** to be there.

5. Save your excel file.

6. Build the application by using docker-compose build command and tag this app based on your needs. 
7. Upload this application to IEM by using IE App Publisher. 
8. Deploy your application to the first edge device. 
9. Go to the device and access the app's UI. Click on "uplaod file" and choose the excel file with configured edge devices. 
10. The process of onboarding then starts automatically. 
11. If none of the edge devices uccure in IEM, download the app logs for more information. 