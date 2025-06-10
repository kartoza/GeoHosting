---
title: Documentation
summary: GeoHosting Controller
  - Irwan Fathurrahman
  - Ketan Bamniya
date: 2024-06-19
some_url: https://github.com/kartoza/GeoHosting-Controller.git
copyright: Copyright 2024, Kartoza
contact:
license: This program is free software; you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
context_id: nDU6LLGiXPTLADXY
---

# G3W-SUITE 

## What is G3W?

**G3W-SUITE** is a modular client-server application designed for the management and publication of interactive map projects. It was created to offer a simple, fast, and autonomous solution for publishing cartographic projects developed with [QGIS](https://qgis.org/) on a WebGIS client.

<br>

<div style="text-align: center;">
  <img src="./img/g3w-img-1.png" alt="G3W Logo" width="300">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
  </div>
</div>

<br>

Built using the **Django** framework and written in **Python**, G3W-SUITE integrates the core components of QGIS to help users build and publish their own Geographic Information System (GIS) solutions in an intuitive way.

<br>

<div style="text-align: center;">
  <img src="./img/g3w-img-2.png" alt="QGIS and Django Logo" width="450 ">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://qgis.org/" target="_blank">QGIS</a>
    , <a href="https://www.djangoproject.com/" target="_blank">Django</a>
  </div>
</div>

---

## Core Technologies

G3W-SUITE is entirely based on well-established Open Source software components, centered around QGIS:

- **QGIS Desktop**: For managing cartographic data, editing, and designing high-quality map projects.
- **QGIS Server**: For publishing QGIS projects as [Open Geospatial Consortium (OGC)](http://www.opengeospatial.org/) services.

<br>

> **Current Compatibility:** 
> 
> G3W-SUITE version 3.9 is compatible with QGIS 3.34 LTR (both Server and Desktop).
> 
> Only the latest LTR (Long-Term Release) version of QGIS is supported.

---

## Modular Architecture of G3W-SUITE

G3W-SUITE is composed of **three primary modules**:

<br>

1. **G3W-ADMIN**

     - Administration interface for project management
     - Handles ACL (Access Control List)
     - Includes an OGC proxy server 
     - Provides a REST API server

     <br>

2. **G3W-CLIENT**

     - A cartographic web client
     - Enables viewing and interaction with published OGC services

     <br>

3. **Front-End Geographic Portal**

     - Provides public access to thematic groups
     - Allows exploration of WebGIS services and related information

<br>

<div style="text-align: center;">
  <img src="./img/g3w-img-3.png" alt="G3W Modules" width="350">
</div>

---

## Key Features and Capabilities

Through the G3W-SUITE web interface, users can:

- **Publish** QGIS projects directly to the WebGIS environment in a structured manner
- **Organize** WebGIS services into multi-level thematic and functional containers
- **Manage** users and groups with customizable functional roles
- **Create** and manage various search methods
- **Edit** spatial data online
- **Extent** capabilities by activating specific functional modules to extend.
- **Define** access permissions for both services and functional modules per user

---

## Version Compatibility and Branch Status

Currently, G3W-SUITE does not follow a traditional versioning system. However, the following branches are available, each aligned with specific versions of Python, Django, and QGIS:

<br>

| **Branch** | **Python** | **Django** | **QGIS** | **QGIS API** | **Status**         |
| ---------- | ---------- | ---------- | -------- | ------------ | ------------------ |
| `dev`      | 3.12       | 4.2        | 3.34     | Used         | Active development |
| `v3.9`     | 3.12       | 4.2        | 3.34     | Used         | Bug fixing         |
| `v3.8`     | 3.10       | 3.2        | 3.34     | Used         | Bug fixing         |
| `v3.7`     | 3.10       | 3.2        | 3.28     | Used         | End of support     |
| `v3.6`     | 3.10       | 3.2        | 3.22     | Used         | End of support     |
| `v3.5`     | 3.10       | 2.2        | 3.22     | Used         | End of support     |
| `v3.4`     | 3.8        | 2.2        | 3.22     | Used         | End of support     |
| `v3.3`     | 3.6        | 2.2        | 3.16     | Used         | End of support     |
| `v3.2`     | 3.6        | 2.2        | 3.16     | Used         | End of support     |
| `v3.1`     | 3.6        | 2.2        | 3.10     | Used         | End of support     |
| `v3.0`     | 3.6        | 2.2        | 3.10     | Used         | End of support     |

---

> **Note:** For more information, see the full [G3W-SUITE](https://g3w-suite.readthedocs.io/en/latest/) documentation.

---
