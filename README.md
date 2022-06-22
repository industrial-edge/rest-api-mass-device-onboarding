# Mass Edge Device onboarding

## Table of Contents

- [Mass Edge Device onboarding](#mass-edge-device-onboarding)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Overview](#overview)
    - [General task](#general-task)
      - [**Application runs on separate server**](#application-runs-on-separate-server)
      - [**Application runs on another device**](#application-runs-on-another-device)
  - [Requirements](#requirements)
    - [Prerequisites](#prerequisites)
    - [Used components](#used-components)
  - [Installation steps](#installation-steps)
  - [Documentation](#documentation)
  - [Contribution](#contribution)
  - [Licence & Legal Information](#licence--legal-information)

## Description

### Overview

This application example can be used to create a JS application that interacts with the IEM and IED public APIs to automatically onboard multiple Edge Devices to the IEM and activate them. Currently, this example shows two onboarding solutions:

- Perform API calls via a standalone docker-based Node.js application in a machine connected to the same IEM/IEDs subnet or
- Run this app on an already onboarded IED.

### General task

[Public Edge Management](https://industrial-edge.io/developer/platform/references/iem/api-portal-1-2-0.html)'s and [Edge Device](https://industrial-edge.io/developer/platform/references/ied/index.html)'s APIs enable us to interact with the system and automate different processes. Here, we laverage those APIs to automate the onboarding process of multiple Edge Devices to the IEM. This documentation describes how to automate this process using a Node.js application. The functionality of the application is as follows. When your Edge Device(s) are setup and have its own IP address(es), you can configure the device configuration in provided [excel-list](src/excel-file/edge_devices.xlsx). The excel file has a strict structure which has to be followed in order for tha application to run correctly. Different configurations are divided in sheets and required information in the each sheet is highlighted with "\*" symbol. The provided file consists of some representative examples.

When you are done configuring the edge devices, you can run the application which then onboards all your edge devices to the IEM using different API calls. The application can run either as a standalone docker-based application or run on another edge device. The process is done synchronously, so the devices are onboarded one after another to prevent IEM overload. More information can be found in [docs](./docs/). The pictures below show the network configuration for each use case. **Important!** This example follows the approach of running the application on edge device.

#### **Application runs on separate server**

![MassOnboard](./docs/graphics/mass_onboard_server.PNG)

#### **Application runs on another device**

![MassOnboard](./docs/graphics/mass_onboard_device.PNG)

## Requirements

### Prerequisites

- Installed Industrial Edge Management
- Linux VM with docker and docker-compose installed
- Installed Industrial Edge App Publisher
- Edge Devices are setup, switched on and with known IP and MAC addresses

### Used components

- Industrial Edge Device V 1.5.0-56
- Industrial Edge Management V 1.5.6
- Industrial Edge Publisher V 1.5.6
- VM Ubuntu 20.04
- Docker 19.03.13

## Installation steps

To successfully run this application you need to follow three steps:

1. [Instalation setup](docs/Installation.md#instalation-setup)
2. [Build and deploy](docs/Installation.md#build-and-deploy-the-application)
3. [Run the app](docs/Installation.md#access-the-application-and-start-the-onboarding-process)

Detailed description of the installation steps can be found [here](docs/Installation.md).

## Documentation

You can find further documentation and help in the following links:

- [Industrial Edge Hub](https://iehub.eu1.edge.siemens.cloud/#/documentation)
- [Industrial Edge Forum](https://www.siemens.com/industrial-edge-forum)
- [Industrial Edge landing page](https://new.siemens.com/global/en/products/automation/topic-areas/industrial-edge/simatic-edge.html)
- [Industrial Edge App Developer Documentation](https://industrial-edge.io/developer/index.html)

## Contribution

Thanks for your interest in contributing. Anybody is free to report bugs, unclear documentation, and other problems regarding this repository in the Issues section or, even better, is free to propose any changes to this repository using Merge Requests.

## Licence & Legal Information

Please read the [Legal information](LICENSE.md)
