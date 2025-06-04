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

# G3W Guide

## Using the Kartoza GeoSpatialHosting Dashboard

After your service has finished setting up, you will be redirected to the Hosted Services page of the GeoSpatial Hosting Dashboard. Here, you can view all your purchased services.

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-4.png" alt="GeoSpatialHosting Dashboard" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://geohosting.sta.do.kartoza.com/" target="_blank">Kartoza GeoSpatialHosting</a>
  </div>
</div>

<br>

**To access your login credentials:**

1. Click the Get Credentials button under your hosted service.

2. Your credentials will be copied to your clipboard.

     > **Hint:** Paste and save your credentials in a secure location.

3. Click the application name you selected for your G3W instance to open it.

     <br>

     <div style="text-align: center;">
       <img src="../img/g3w-img-5.png" alt="Hosted Services" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://geohosting.sta.do.kartoza.com/" target="_blank">Kartoza GeoSpatialHosting</a>
       </div>
     </div>
     
<br>

**To delete a hosted service:**

1. Click the 3 dots in the corner of the hosted service pane.

2. From the dropdown menu, select **Delete**.

<br>

> **⚠️ IMPORTANT** 
> 
> Deleting a hosted service is **permanent**. All associated data will be irreversibly removed with **no option for recovery**.

---

## Getting Started

### Accessing the Online Service

G3W-SUITE includes a **front-end geographic portal** that allows public access to thematic WebGIS groups and services, making spatial data easy to explore and interact with.

<br>

You can access the portal in two ways:

1. **Via direct URL**

     Open your browser and navigate to:

     ```
     http://<application_name>.sta.do.kartoza.com/g3w
     ```

     <br>

2. **Via the GeoSpatial Hosting Dashboard**

     Click the application name you selected for your G3W instance.

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-6.png" alt="Front-End Geographic Portal" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
  </div>
</div>

---

### Portal Overview

The **home page** serves as the main entry point to the platform. It includes a customizable welcome message and intuitive navigation menus that provide access to various functionalities.

<br>

**Right-Side Panel Menu**

 This panel contains quick-access links:

 - About It - view service-related information
 - Maps - explore available WebGIS services
 - Login - access additional services

---

1. **About It**

      This section can display a short description and key contact details relevant to your organization or project.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-7.png" alt="About It Section" width="auto">
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      --- 

2. **Maps**

      G3W-SUITE organizes WebGIS services in a **hierarchical containers**:

      - Cartographic Macrogroups – top-level thematic categories
      - Cartographic Groups – subcategories containing specific services

      <br>

      **Browsing Maps:**

      1. Click on **Maps** from the panel.

      2. Available Macrogroups (if any) will be displayed under **Thematic Groups**.

      3. Selecting a Macrogroup shows its associated **Groups**.

      4. Groups list the individual **WebGIS services**.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-8.png" alt="Maps Section" width="auto">
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      ---

3. **Login**

      To access the Administration Panel it is necessary to log in using the administrator credentials.

      <br>

      **To log in:**

      1. Click on **Login** from the panel.

      2. Enter the credentials you generated earlier from the GeoSpatialHosting Dashboard:

           - **Username:** `admin`
           - **Password:** `*generate from dashboard*`

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-9.png" alt="Login" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

      **Once logged in**, additional services will be visible, including:

      - Restricted Macrogroups
      - Restricted Groups and WebGIS services based on your access permissions

       <br>

      > **Hint:** Need help finding your credentials? See the section: [Using the Kartoza GeoSpatialHosting Dashboard](https://kartoza.github.io/GeoHosting/products/g3w/guide/#using-the-kartoza-geospatialhosting-dashboard)
      
      <br>

      ---

4. **Admin**

      Once logged in, the Login Section is replaced with the **Admin Section**. 

      <br>

      From here, you can:

      - **Logout** of G3W-SUITE
      - Access the **Administration Panel** through the **Backend** button.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-10.png" alt="Admin Section" width="auto">
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
         Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
 
<br>

> **Note:** For more details, refer to the [G3W-FRONTEND](https://g3w-suite.readthedocs.io/en/latest/g3wsuite_access_portal.html#g3w-frontend-the-front-end-portal) section of the official G3W documentation.

---

### Administration panel

The **Administration Panel** is the control center for managing all key aspects of your G3W-SUITE instance. Through this interface, you can:

- Customize the access portal
- Create and manage users and user groups
- Define Cartographic MacroGroups and Groups, along with access and management policies
- Publish QGIS projects as WebGIS services
- Maintain and enhance WebGIS services (e.g., search tools, custom functions)

<br>

You can access the Administration Panel in two ways:

1. **Via the Administration button**

      From any section in the portal interface, simply click the **Administration** button in the top-right corner.
      
      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-11.png" alt="Administration button" width="auto">
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

2. **Via the Admin Section**

      Once logged in, navigate to the Admin Section and click the **Backend** button.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-12.png" alt="Backend button" width="auto">
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

> **Note:** Access to the Administration Panel requires logging in with administrator credentials. 

> **Hint:** Need help logging in? Refer to the **Login** section under [Portal Overview](https://kartoza.github.io/GeoHosting/products/g3w/guide/#portal-overview). 

<br>

Upon logging into the Administration Panel, you’ll see the following elements:

1. **Top Bar**

      - **Frontend:** Return to the main public-facing portal
      - **Username:** Access your profile or log out
      - **Language:** Select your preferred interface language
      - **Gear icon:**

           - Edit General Data: Customize portal information
           - Django Administration (admin-only): Access Django backend settings
           - Files: Open the integrated File Manager tool

       <br>

2. **Left-Side Navigation Menu**

      Provides access to all administration functions:

      - **Dashboard:** Quick access to the Admin homepage
      - **Cartographic Groups:** Create and manage WebGIS groups
      - **Macro Cartographic Groups:** Create and manage high-level thematic containers
      - **Users:** Manage individual users and user groups

      <br>

3. **Central Dashboard Area**

      The center of the screen displays:
     
      - **Dashboard:** Displays an overview and quick links to Cartographic Groups
      
      <br>

<div style="text-align: center;">
  <img src="../img/g3w-img-13.png" alt="Administration panel" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
  </div>
</div>

<br>

> **Note:** For more details, refer to the [G3W-ADMIN](https://g3w-suite.readthedocs.io/en/latest/g3wsuite_administration.html#g3w-admin-the-administration-panel) section of the official G3W documentation.

---

## Tutorial

### Overview

This tutorial is centered around a QGIS project designed to manage a layer representing a collection of buildings within a specific geographic area.

Beyond **spatial data**, the project also handles a wide range of **attribute information**, including maintenance records, using a 1:n relational structure to allow each building to be associated with multiple maintenance entries.

<br>

Throughout the tutorial, you will gain **practical skills** in:

1. **Customizing** the graphic and functional elements of the base QGIS project.
2. **Publishing** the project as a WebGIS service using G3W-SUITE.
3. **Creating** custom search tools for efficient data exploration.
4. **Integrating** interactive charts using the DataPlotly plugin.
5. **Enabling** online editing, including:

      - Custom form layouts
      - Specialized widgets for improved user interaction

     <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-14.png" alt="Gained Practical Skills" width="175">
      </div>

<br>

> **Note:** This tutorial aims to demonstrate how a real-world GIS project can be fully managed through G3W-SUITE and QGIS.

---

### Data Preperation

This tutorial is based on a modified dataset and QGIS 3.34.x LTR project from the official [G3W-SUITE](https://g3w-suite.readthedocs.io/en/latest/index.html) documentation website. Download the **Tutorial Data** using the link below:

- [`Tutorial_Data.zip` Download](insert link)

<br>

> **Note:** You can download the origianl data from the [Download Demo Data](https://g3w-suite.readthedocs.io/en/latest/demo.html#download-demo-data) section of the G3W-SUITE Documentation

<br>

#### Overview

The downloaded `.zip` file includes a `Tutorial_Data_G3WSUITE` folder, containing an image and the following **three subdirectories**:

<br>

📁 **`projects/`**

 - Contains the QGIS project file: `public-buildings-management-demo-39.qgs`
 - The project is fully optimized for this tutorial.

 <br>

📁 **`plots/`**

 - Contains plot definitions created using the DataPlotly plugin, saved in `.xml` format.

 <br>

📁 **`project_data/spatialite/`**

 - Contains the SpatiaLite database: `build_management_demo.sqlite`
 - This database stores the core data used in the project.

 <br>

Inside the **`build_management_demo.sqlite`** file, you’ll find the following layers:

 <br>

 | Layer Name          | Type    | Description                                                      |
 | ------------------- | ------- | ---------------------------------------------------------------- |
 | `buildings`         | Polygon | Main reference layer for editing building features               |
 | `maintenance_works` | Table   | Records of maintenance activities linked to individual buildings |
 | `buildings_rating`  | Table   | Annual ratings or assessments of buildings                       |
 | `roads`             | Line    | Road network used to assign addresses to buildings               |
 | `work_areas`        | Polygon | Work zone boundaries used to define geo-constraints              |
 | `type_subtype`      | Table   | Lookup table for building type and subtype values                |

 <br>
 
The QGIS project (based on QGIS 3.34.x LTR) is pre-configured with the following **features**:

1. **Categorized symbology** for the:

       - `buildings` layer based on the `type` field.

       <br>

2. **1:n relationships defined between:**

       - `buildings` ↔ `maintenance_works`
       - `buildings` ↔ `buildings_rating`

       <br>

3. **Pre-built query forms for:**

       - `buildings` layer
       - `maintenance_works` table

       <br>

4. **Predefined editing widgets for:**

     - `buildings`, `maintenance_works`, and `buildings_rating` attributes

     <br>

5. **Four print layouts:**

     - Two standard layout templates
     - Two atlas layout templates using features from the buildings layer

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-15.png" alt="Tutorial QGIS Project" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://qgis.org/" target="_blank">QGIS</a>
  </div>
</div>

---

#### Exercise

Before publishing your QGIS project to the WebGIS platform, you **must update the project title**, as it will serve as the unique identifier for the published WebGIS service.

> **Note:** The publication system uses the project title as the WebGIS service ID. If not updated, your service may be misidentified or conflict with others.

<br>

**Steps to update the project title:**

1. Open your QGIS project.

2. Go to the **Project** menu.

3. Select **Properties...**

4. Under the **General tab**, locate the **Project Title** field.

5. Enter a unique and descriptive title for your project.

6. Click **OK** to apply the changes.

      <br>

      **Make sure the title:**

      - Reflects the content or purpose of your project.
      - Does not contain special characters or excessive spacing.
      - Is short but specific enough to identify the service in the WebGIS environment.

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-16.png" alt="Updating Project Title" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://qgis.org/" target="_blank">QGIS</a>
  </div>
</div>

<br>

> **Note:** For more details, refer to the [QGIS: project settings](https://g3w-suite.readthedocs.io/en/latest/projectsettings.html#qgis-project-settings) section of the official G3W documentation.

---

### Publishing a QGIS Project

Once you've updated the project title, you're ready to begin publishing it as a WebGIS service.

---

#### Overview

Publishing a QGIS project is done through the **Dashboard**, which provides access to:

- Your assigned **Cartographic-** and **Macro Cartographic Groups**
- **Additional module menus** for managing services and settings 

<br>

**To publish a project, you’ll need to:**

1. Create a **Cartographic Macro Group**

2. Create a **Cartographic Group**

3. Complete a series of **project form fields**, organized as follows:

<br>

| **Section**            | **Field**           | **Description**                                              |
|------------------------|---------------------| -------------------------------------------------------------|
| **QGIS Project**       | QGIS prioject file  | Upload the `.qgz` or `.qgs` file representing your QGIS project.                                |
| **ACL Users**          | Viewer users        | Select individual users allowed to view the WebGIS. Use `AnonymousUser` to allow public access. |
|                        | Viewer user groups  | Assign user groups that can view the WebGIS content.                                |
| **Default Base Layer** | Base layer          | Choose a default base layer to display at startup (optional, limited to those defined for the group).|
| **Description Data**   | Public title        | Title shown in the WebGIS interface. Falls back to project title or filename if left blank.              |
|                        | Description         | A short description of the project shown in the portal.                                 |
|                        | Thumbnail (Logo)    | Image/logo used to represent the project in the list view.                                   |
|                        | URL alias           | Human-readable URL path for accessing the WebGIS.                                 |
     
<br>

> **Note:** Fields marked with an asterisk (*) are required.

<br>

In the **Options and Actions** section, you can toggle several key features that influence how the WebGIS service behaves at runtime:

<br>

| **Option**                            | **Description**                                                          |
|---------------------------------------|------------------------------------------------------------------------|                                              
| **Tab's TOC active as default**       | Open the TOC tab (Layers, Base Layers, etc.) by default when the client loads.          |
| **Tab's TOC layer initial status**    | Set whether the layers in the TOC start as collapsed or expanded.        |
| **Map themes list initial status**    | Set whether the map theme list starts as collapsed or expanded.          |
| **Legend position rendering**         | Choose whether the legend appears in a separate tab or within the TOC    panel.          |
| **WMS GetMap image format**           | Specify the preferred image format for WMS GetMap requests.              |
| **Max feature to get for query**      | Set the maximum number of features returned from a query.                |
| **Query control mode**                | Define whether queries allow single or multiple selections.              |
| **Query by bbox control mode**        | Set bounding box queries to single or multiple mode.                     |
| **Query by polygon control mode**     | Set polygon-based queries to single or multiple mode.                    |
| **Geocoding providers**               | Configure which geocoding services are available for address-based searches.       |

<br>

Now that you're familiar with the workflow and the publishing interface key components, let’s apply this knowledge.

---

#### Exercise

**Creating a Macro Group**

Follow the steps below to create a Macro Cartographic Group in G3W-SUITE:

<br>

1. Open a web browser and navigate to:

      ```
      http://<application_name>.sta.do.kartoza.com/g3w
      ```

      <br>

2. Log in to G3W-SUITE using your **administrator credentials**.

      - **Username:** `admin`
      - **Password:** `*generate from dashboard*`

      <br>

      > **Hint:** Need help finding your credentials? See the section: [Using the Kartoza GeoSpatialHosting Dashboard](https://kartoza.github.io/GeoHosting/products/g3w/guide/#using-the-kartoza-geospatialhosting-dashboard)
      
      <br>

3. Once authenticated, navigate to the **Administration Panel**

      <br>

      > **Hint:** Need help navigating to the Administration Panel? Refer to the [Administration Panel](https://kartoza.github.io/GeoHosting/products/g3w/guide/#administration-panel) section. 
      
      <br>

4. In the left-side navigation menu, click **Dashboard**.
 
       <br>

       <div style="text-align: center;">
       <img src="../img/g3w-img-17.png" alt="Dashboard" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
       </div>

       <br>

5. Within the Dashboard, locate the light blue **Groups** box.

      <br>

6. Click **Show** to display the list of existing **Cartographic Groups**.

      <br>
     
      <div style="text-align: center;">
       <img src="../img/g3w-img-18.png" alt="Groups Box" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

7. In the left navigation bar under **Macro Cartographic Groups**, click **Add MACRO Group**

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-19.png" alt="Cartographic Groups" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
    
      <br>

8. On the Macro Group creation page, under the **General Data** section, complete the following fields:

      - **Identification name:** `Tutorial Group`
      - **Title:** `Tutorial Group`

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-20.png" alt="Macro Group Form" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

9. In the **Logo Image** section, upload the `tutorial_image` PNG located in the `Tutorial_Data_G3WSUITE` folder.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-21.png" alt="Logo Image Section" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

10. Once all fields are complete, click **Save** to finalize the creation of your Macro Group.

      <br>

---

**Creating a Group**

Follow the steps below to create a Cartographic Group within G3W-SUITE:

<br>

1. In the left-side navigation bar, under **Cartographic Groups**, click on **Add Group**

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-22.png" alt="Cartographic Macro Groups" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
    
      <br>

2. On the Group Creation page, under the **General Data** section, fill out the following fields:

      - **Name:** `Project Group`
      - **Title:** `Project Group`

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-23.png" alt="Group Form 1" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

3. In the **MACRO Groups** section, select the previously created group: `Tutorial Group`

      <br>

4. Under **GEO Data**, set the Coordinate Reference System (CRS) to `EPSG 3857`.

      <br>

      > **Hint:** Not sure about your project's CRS? In QGIS, go to **Project → Properties → General** to confirm the EPSG code.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-24.png" alt="Group Form 2" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
      
      <br>

5. In the **Base Layers and Map default features** section, select **OSM (OpenStreetMap)** as your baselayer.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-25.png" alt="Group Form 3" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
      
      <br>

6. In the **Logo/Picture** section, upload the `tutorial_image` PNG located in the `Tutorial_Data_G3WSUITE` folder.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-26.png" alt="Group Form 4" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

7. Once all details are complete, click the **Save** button to finalize your group setup.

      <br>

---

**Adding a QGIS Project**

1. In the **Cartographic Groups** tab, under `Project Group`, click the **Add New Project** button. 

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-27.png" alt="Add Project" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

2. The **New QGIS Project** page opens.

      <br>

3. Under the **QGIS Project** section, upload your `.qgz` or `.qgs` file from: `Tutorial_Data_G3WSUITE → projects`

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-28.png" alt="New QGIS Project 1" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

4. Under **Descriptive Data**, complete the following fields:

      - **Public Title:** `Tutorial_G3WSUITE`
      - **Thumbnail:** `tutorial_image`

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-29.png" alt="New QGIS Project 2" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
      
      <br>

5. Under **Default Base Layer**, choose **OSM (OpenStreetMap)**.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-30.png" alt="New QGIS Project 3" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

6. In the **Options and Actions** section, leave all settings at their default values.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-31.png" alt="New QGIS Project 4" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>
      
      <br>

7. Click the **Save** button.

Once successfully published, the project will appear in the **WebGIS services list** under the Cartographic Group. You can click the **View Map** icon to launch and explore the live WebGIS.

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-32.png" alt="Live WebGIS" width=auto>
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
  Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
  </div>
</div>

<br>

> **Note:** For more details, refer to the [Publish the QGIS project as a WebGis service](https://g3w-suite.readthedocs.io/en/latest/demo.html#publish-the-qgis-project-as-a-webgis-service) section of the official G3W documentation.

---

### Updating the Published WebGIS Service

You can update both the **graphic** and **functional elements** of an existing WebGIS service in G3W-SUITE.

---

#### Overview

To update a published WebGIS service:

1. **Access the Project List** by navigating to the list of projects under the appropriate Cartographic Group.

2. **Edit the WebGIS Service** by clicking the **Edit** icon next to the desired WebGIS service to upload a modified QGIS file and update configuration options.

<br>

From the WebGIS services list, you can manage a wide range of functionalities using **tools** associated with each project. This allows you to view, modify, and control individual project behavior. Below is a guide to the available **tools and their functionality**:

<br>

<div style="text-align: center;">
  <img src="../img/g3w-img-33.png" alt="Functional Tools" width=auto>
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
  Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
  </div>
</div>
 
---

#### Excercise

**Setting Up an Overview Map**

You can define a **panoramic overview map** (mini-map) for your WebGIS group. This map appears in a corner of the main WebGIS interface and provides spatial context.

<br>

1. In the **Cartographic Groups** tab, under the `Project Group`, click the **Projects** button.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-34.png" alt="Project Group" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

2. Locate the `Tutorial_G3WSUITE` project and check the box in the **Overview** column.

      <br>

      <div style="text-align: center;">
       <img src="../img/g3w-img-35.png" alt="Overview Column" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
      </div>

      <br>

3. Click the **Save** button. Your updates will now be applied. 

<br>

Return to the cartographic client and launch the WebGIS to verify the updated configuration, including the newly defined overview map. Use the **View Map** icon from the project list to open the WebGIS and check changes in real time.

<br>

> **Note:** For more details, refer to the [Update/Manage WebGis services](https://g3w-suite.readthedocs.io/en/latest/g3wsuite_administration.html#update-manage-webgis-services) section of the official G3W documentation.

---

### Activating additional functions

Once your project has been published, you can enhance your WebGIS service by enabling a variety of widgets and additional functions.

---

#### Overview


---

#### Exercise

1. Click the **Layers list** icon to access the list of geographic layers in your project. 

     <br>
     
     <div style="text-align: center;">
       <img src="../img/geoserver-img-21.png" alt="Layers List" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
     </div>

     <br>
     
     The new section will display **all layers** included in the published QGIS project and allows you to configure various functional aspects that will be available in the WebGIS client.

     <br>
     
     <div style="text-align: center;">
       <img src="../img/geoserver-img-21.png" alt="Layers List" width=auto>
       <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
       Image credit: <a href="https://g3wsuite.it/en/g3w-suite-publish-qgis-projects/" target="_blank">G3W-SUITE</a>
       </div>
     </div>

     <br>

2. The **Data** tab contains several fields, including:

     | Field            | Description                                                   |
     |------------------|---------------------------------------------------------------|
     | **Label**        | Alias set in the QGIS project                                 |
     | **ID**           | Unique identifier (eye icon) used for parameterized URLs      |
     | **Name**         | Layer name (file or DB table)                                 |
     | **Type**         | Data source type (WMS, PostGIS, GDAL, etc.)                   |
     | **WMS External** | Option to handle GetFeatureInfo responses outside QGIS Server |
     | **WFS**          | Indicates if the layer is available as WFS                    |

     > **Note:** WMS layers are handled directly by Django to speed up loading, bypassing QGIS Server.
     
     <br>

3. Under the **Actions** field you wil find **Layer Action Icons** that provide access to several management tools:

     | Icon         | Function                                                            |
     |--------------|---------------------------------------------------------------------|
     | Cache        | **Caching Layer**: Enable/manage cache at project level             |
     | Edit         | **Editing Layer**: Toggle online editing                            |
     | Hide Layer   | **Hide Layer by User/Group**                                        |
     | Plotly       | **QPlotly Widget**: Add/manage DataPlotly plots                     |
     | Geo          | **Geo Constraints**: Restrict access/editing based on polygons      |
     | Alpha        | **Alphanumeric Constraints**: Constraints via SQL/QGIS expressions  |
     | Columns      | **Hide Columns by User/Group**                                      |
     | Widget       | **Widgets List**: Manage layer-specific widgets                     |
     | Style        | **Manage Layer Styles**                                             |

     > **Hint:** Each action icon displays a number indicating how many related objects are configured.
     
     <br>

4. The **Download Capabilities** field allows for the download of vector and raster data in the following formats:

     | Format      | Available For                  |
     |-------------|--------------------------------|
     | SHP/GeoTIFF | Vector and raster layers       |
     | GPKG        | All layers                     |
     | XLS         | All layers                     |
     | CSV         | All layers                     |
     | GPX         | Geographic layers              |
     | PDF         | Attribute-level export for all |

     <br>

5. The **Visibility Capabilities** allows you to configure general visibility options (applies to all users):

     | Option                    | Effect                   |
     |---------------------------|--------------------------|
     | **Hide Attributes Table** | Disables attribute table |
     | **Hide Legend**           | Disables legend display  |
     | **Hide Layer TOC**        | Removes layer from TOC   |

     <br>

> **Hint:** Try enabling these features and test them directly in your WebGIS interface.

---

#### Creating a Search Widget

To add a search tool to your WebGIS:

1. Select the vector layer you want to target and click the **Widget List** icon.

     > **Note:** There may already be existing searches created by other users. You can activate them by checking the Linked checkbox.

     <br>

2. You can modify, delete, or unlink existing searches using the **action** icons.

3. To create a new one, click the **New Widget** link.

4. In the **Widget Creation Form**, you're able to configure the following fields:

     | Field            | Description                                                          |
     | ---------------- | -------------------------------------------------------------------- |
     | **Form Title**   | Name shown in interface                                              |
     | **Type**         | "Search"                                                             |
     | **Name**         | Internal reference name                                              |
     | **Search Title** | Display name in the WebGis interface                                 |
     | **Field**        | Field to search on                                                   |
     | **Widget**       | InputBox, SelectBox, AutoCompleteBox                                 |
     | **Alias**        | Field display name                                                   |
     | **Description**  | Additional info                                                      |
     | **Operator**     | =, <, >, <=, LIKE, ILIKE, etc.                                       |
     | **Dependency**   | Filter values based on previous fields (only for PostGIS/SpatiaLite) |

     <br>

5. You can use the **Add Field** button to include multiple conditions using `AND/OR` logic.

6. **Example:** Creating a search widget for a cadastral layer.

7. Once the form is completed, click **OK** to save.

The new search widget will appear in the layer's widget list and be automatically activated in the WebGIS interface.

---

#### Creating a Plots Widget

Enables you to add charts created using the **DataPlotly** QGIS plugin (developed by Matteo Ghetta) to your WebGIS service. Charts are saved as `.xml` files and are linked to specific layers. This allows consistent reuse of the same plots across different WebGIS services, as long as the related layer is present.

> **Hint:** You can also activate plots created by other users by checking the Linked checkbox.

Title: Defined in QGIS/DataPlotly and used as the unique identifier

Try creating plots in your QGIS project, export them as .xml, and upload them to see them in your WebGIS.

<br>

Plots can be **filtered** by:

1. Map Extent: Based on visible features

2. Feature Selection: Based on selected features

These filters also apply to related plots (1:N relationships), updating automatically as users pan or zoom on the map. If enabled, selection-based filtering is automatically applied to all related charts connected to the same layer. Clear messages will indicate which filters are active on each plot. If a layer has 1:N relationships with other tables and those tables have active plots, users can view these charts by querying the parent layer and clicking the Show relation charts icon.

<br>

Show Relation Charts: Displays plots from related 1:N tables if they exist and have active charts.

---

# Editing on line
_**Forms and editing widgets are already defined on the project associated with the tutorial for the geometric layer of buildings and for the alphanumeric table related interventions_maintenance.**_

* **`Buildings`**
  * **id** (integer - primary key): autogenerate
  * **name** (text NOT NULL): text edit
  * **address** (text): Value relation (roads layer - code/name fileds)
  * **zone** (text): text edit (with default values based on a QGIS expression to for association with the intersecting works area)
  * **type** (text NOT NULL): unique values (Administrative, Commercial, Residential)
  * **subtype** (text NOT NULL): value relation with multiple selections (based on type_subtype table for a drill-down cascading forms)
  * **attachment** (integer): check box 1/0 (the visibility of the conditional form Documents is based on this field)
  * **photo** (text): attachment
  * **link** (text): text edit
  * **form** (text): attachment
  * **user** (text): text edit (automatically filled in with the G3W-SUITE  username creator of the feature)
  * **year** (integer NOT NULL): unique values (2015,2016,2017,2018,2019,2020)
  * **high** (integer NOT NULL): range (10-30 step 2)
  * **volume** (integer): range (50-200 step 10)
  * **surface** (integer): text edit
  * **architectural_barriers** (text): Checkbox (Checked - Not checked)
  * **date_barriers** (date): date (yyyy/MM/dd)
  * **safety_exits** (text): checkbox (Checked - Not checked)
  * **date_exits** (date): date (yyyy/MM/dd)
  * **fire_system** (text): Checkbox (Checked - Not checked)
  * **date_fire** (date): date (yyyy/MM/dd)


* **`Maintenance_works`**
  * **id** (integer - primary key): autogenerate
  * **id_buildings** (text - relation key): text edit
  * **maintenance** (text NOT NULL): unique values
  * **date** (date): date (yyyy/MM/dd)
  * **form** (text): attachment
  * **value** (integer): range (10-30 step 2)
  * **outcome** (text): unique values (good, medium, bad)
  * **responsible** (text): text edit
  * **cost** (integer): range (1000-5000 step 1)
  * **validation** (boolean): checkbox (0/1)
   
* **`Buildings rating`**
  * **id** (integer - primary key): autogenerate
  * **id_buildings** (text - relation key): text edit
  * **date** (date): date (yyyy/MM/dd)
  * **value** (integer): range (1000-4000 step 500)
  * **year** (integer): range (2018-2022 step 1)

To activate the editing function on webgis, access the list of layers and identify the three layers shown above.

![](./img/g3w-guide-img-39.png)

Clicking on the icon **Editing layer** ![](./img/g3w-guide-img-40.png) (placed at the left of each rows) will open a modal window that will allow you to:
* define the **`editing activation scale`** (only for geometric tables)
* define the **`Viewer users`** (individuals or groups) **`enabled`** for online editing

With regard to the last aspect, it should be noted that **Viewers users** (individuals or groups) **available** in the drop-down menu **will be limited to those who have allowed access in consultation to the WebGis project**

![](./img/g3w-guide-img-41.png)
![](./img/g3w-guide-img-42.png)
![](./img/g3w-guide-img-43.png)
![](./img/g3w-guide-img-44.png)

Once the editing function is activated, updating the service, the **`Tools menu` will appear on the left panel.**

**By activating the editing function it will be possible to edit the geometries and attributes of the Public Buildings layer and the related interventions.**

![](./img/g3w-guide-img-45.png)
![](./img/g3w-guide-img-46.png)
![](./img/g3w-guide-img-47.png)

For **further information** on the web editing function, read the [**dedicated chapter on the manual**](https://g3w-suite.readthedocs.io/en/v3.9.x/g3wsuite_editing.html#online-editing-tools-at-cartographic-client-level)

# Personalize your demo

**Do you want to test the online editing function more deeply?**

Redefine attribute forms, aliases and editing widgets associated with the individual fields and reload the project to check the new settings.

**It is advisable to consult the** [paragraph dedicated](https://g3w-suite.readthedocs.io/en/v3.9.x/g3wsuite_editing.html#activation-and-configuration) **to the list and limitations of the individual editing widgets inheritable from the QGIS project.**
