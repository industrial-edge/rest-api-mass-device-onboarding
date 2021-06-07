# Automatic Edge Device onboarding

This documentation shows how to use provided application that can automaticaly onboard edge devices to IEM over public API.

- [Automatic Edge Device onboarding](#automatic-edge-device-onboarding)
  - [Installation steps](#installation-steps)

## Installation steps

To use provided docker based application to onboard your edge devices, follow the provided steps.

1. Clone this repository to your Linux VM that has connection to your IEM.
**_Pro Tip:_**  This application can be integrated into CI/CD pipeline that runs on a CI/CD server.

2. Setup and connect your edge devices to your network which has acess to the IEM and with a DHCP server available. At the end of this step, you should have the edge devices connected with a know IP adresses and ready to be activated.

3. Open the provided [excel-file](../src/devices/edge_devices_v0.0.1.xlsx) and fill out the excel sheets devided based on different edge device configuration. Required fieds are marked with a "*" symbol. Each device should have a unique ID starting from 1. If you want to have no configuration of your edge device in a certain configuration sheet, leave the colomn empty, but the ID still **has** to be there.

4. Save your excel file and put it inside of the [devices](../src/devices) folder.

5. Go to the [src](../src) folder and run the provided application with executing following command: 

```bash
sudo docker-compose up
```
The application should go through your configurated edge devices and make API calls to onboard them to your IEM. 