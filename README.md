# Mass Edge Device onboarding

Automate process of onboarding and activating Edge Devices using public API. Mass onboarding of edge devices over 1 edge device or separate server. 

- [Mass Edge Device onboarding](#mass-edge-device-onboarding)
  - [Description](#description)
    - [Overview](#overview)
    - [General task](#general-task)
  - [Requirements](#requirements)
    - [Prerequisites](#prerequisites)
    - [Used components](#used-components)
  - [Installation steps](#installation-steps)
  - [Documentation](#documentation)
  - [Contribution](#contribution)
  - [Licence & Legal Information](#licence--legal-information)

## Description

###  Overview

This application example shows how to create application that interacts with IEM and IED public API to automaticaly onboard Edge Devices to IEM.

### General task

Public Edge Management's and Edge Device's API enable us to interact with a system and automate different processes. One of the process that can be automated is onboarding of Edge Devices to the IEM. Provided documentation describes how this can be done using Node.js application. Te functionality of the application is as follows. When your Edge Device(s) are setup and have its own IP adress(es), you can configure the device configuration in provided [excel list](./src/devices/edge_devices_v0.0.1.xlsx). Different configurations are devided in sheets and required information is highlighted with "*" symbol. When you are done configuring the edge devices, you can configure required enviroment variables and run the application which then onboards all your edge devices to the IEM using different API calls. The process is done asynchronously. More information can be found in [docs](./docs/). 

## Requirements

### Prerequisites

- Installed Industrial Edge Management
- Linux VM with docker and docker-compose installed
- Linux VM has connection to IEM
- Edge Device is setup with known IP adress


### Used components

- Industrial Edge Device V 1.2.0-56
- Industrial Edge Management V 1.2.14
- VM Ubuntu 20.04
- Docker 19.03.13

## Installation steps



## Documentation

- You can find further documentation and help in the following links
  - [Industrial Edge Hub](https://iehub.eu1.edge.siemens.cloud/#/documentation)
  - [Industrial Edge Forum](https://www.siemens.com/industrial-edge-forum)
  - [Industrial Edge landing page](https://new.siemens.com/global/en/products/automation/topic-areas/industrial-edge/simatic-edge.html)
  
## Contribution
Thanks for your interest in contributing. Anybody is free to report bugs, unclear documentation, and other problems regarding this repository in the Issues section or, even better, is free to propose any changes to this repository using Merge Requests.

## Licence & Legal Information
Please read the [Legal information](LICENSE.md)