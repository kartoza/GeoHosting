---
title: Documentation
summary: GeoHosting Controller
  - Irwan Fathurrahman
  - Ketan Bamniya
  - Jeff Osundwa
date: 2024-06-19
some_url: https://github.com/kartoza/GeoHosting-Controller.git
copyright: Copyright 2024, Kartoza
contact:
license: This program is free software; you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
context_id: nDU6LLGiXPTLADXY
---

# GeoNode Guide

## Using the Kartoza GeoSpatialHosting Dashboard

After your service has finished setting up, you will be redirected to the Hosted Services page of the GeoSpatial Hosting Dashboard. Here, you can view all your purchased services.

<br>

<div style="text-align: center;">
  <img src="../img/geonode-img-3.png" alt="GeoSpatialHosting Dashboard" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://geohosting.sta.do.kartoza.com/" target="_blank">Kartoza GeoSpatialHosting</a>
  </div>
</div>

<br>

**To access your login credentials:**

1. Click the Get Password button under your hosted service.

2. Your credentials will be copied to your clipboard.

     > **Hint:** Paste and save your credentials in a secure location.

3. Click the application name you selected for your GeoNode instance to open it.

     <br>

     <div style="text-align: center;">
       <img src="../img/geonode-img-4.png" alt="Hosted Services" width=auto>
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

### Accessing the Homepage

You can access the GeoNode Homepage in two ways:

1. **Via direct URL**

     Open your browser and navigate to:

     ```
     http://<geonode_application_name>.sta.do.kartoza.com/#/
     ```

     <br>

2. **Via the GeoSpatial Hosting Dashboard**

     Click the application name you selected for your GeoNode instance.

<br>

<div style="text-align: center;">
  <img src="../img/geonode-img-5.png" alt="Homepage" width="auto">
  <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
    Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
  </div>
</div>

<br>

---

### Creating an Account

1. On the GeoNode Homepage, click **Register** to start creating your account.

     <br>
  
     <div style="text-align: center;">
      <img src="../img/geonode-img-6.png" alt="Register" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>
     
     <br>

2. On the **Sign Up** form, enter your username, email, and password.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-7.png" alt="Sign Up" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

3. Click the **Sign Up** button.

     <br>

You will be redirected to the **GeoNode Homepage** where you can begin using your account.

---

### Setting Up Your Profile

1. In the top navigation menu, click the **Avatar icon → Profile** to access your user profile.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-8.png" alt="Avatar Icon" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. On your profile page, click the **Edit Profile** button to update your personal details.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-9.png" alt="Profile" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

3. On the **Edit Your Profile** page, you can add or update the following information:

     - Name & Surname
     - Organization Information
     - Contact Information
     - Profile Picture

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-10.png" alt="Edit Profile" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

4. After updating your details, click the **Update Profile** button at the bottom of the page to save your changes.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-11.png" alt="Update Profile" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

---

## Tutorial

### Overview

**GeoNode** is a powerful platform for the management and publication of geospatial data. It integrates mature, stable open-source software projects under a user-friendly interface.

With GeoNode's **simplified architecture**, non-specialized users can easily share geospatial data and create interactive maps without advanced GIS skills.

<br>

#### Geospatial Data Storage

GeoNode supports uploading **vector** and **raster** datasets through a simple web form. Supported vector formats include Shapefiles, GeoJSON, CSV, KML, and KMZ, while raster data like satellite imagery is stored as GeoTIFFs in their original projections.

<br>

| Feature                     | Vector Data                                | Raster Data                      |
| --------------------------- | ------------------------------------------ | -------------------------------- |
| **Formats**                 | Shapefile, GeoJSON, CSV, KML, KMZ          | GeoTIFF                          |
| **Storage**                 | Converted into geospatial database tables  | Stored as GeoTIFF files          |
| **Examples**                | Roads, boundaries, facilities              | Satellite imagery, aerial photos |
| **Projection Handling**     | Preserved and reprojected for map display  | Preserved in original projection |
| **Use in Map Creation**     | Searchable, combinable with other layers   | Searchable, visual backdrop for analysis   |

<br>

GeoNode emphasizes the use of **standard metadata formats**, particularly ISO 19139:2007 / ISO 19115, ensuring proper cataloging and interoperability.

Immediately after uploading, users can fill in the **resource metadata**, making the dataset instantly available via **CSW (OGC Catalogue Service) endpoints and APIs**.

Users can also upload **metadata XML files** (ISO, FGDC, or Dublin Core formats) to auto-populate key metadata fields.

Additionally, GeoNode offers a **web-based style editor** that lets users customize layer symbology and preview changes in real time.

<br>

#### Data Mixing and Map Creation

Once datasets are uploaded, GeoNode allows users to:

- **Search** for data by location or keyword.
- **Mix datasets** and create interactive maps with ease.

<br>

All layers are **automatically re-projected to Web Mercator**, enabling seamless integration with popular basemaps like OpenStreetMap, Google Satellite, and Bing Maps.

<br>

Maps created in GeoNode can be:

- **Embedded** in other websites.
- **Exported** as PDFs for offline use or printing.

<br>

#### GeoNode as a Building Block

GeoNode’s modular, Django-based design makes it highly extendable. Many open-source projects build on GeoNode by reusing its components.

You can explore real-world implementations in the [GeoNode Projects Gallery](https://geonode.org/gallery/).

The GeoNode development community is active, welcoming, and highly supportive of new contributors, providing guidance and ideas to help newcomers get started.

<br>

> **Note:** For more details, refer to the [GeoNode Basics](https://docs.geonode.org/en/master/start/index.html#geonode-basics) section of the official GeoNode documentation.

---

### Data Preperation

#### Overview

This tutorial uses an extract of the Berlin city center buildings map from the **BBBike OpenStreetMap extracts**. Download the **Tutorial Data** using the link below:

- [`Tutorial_Data_GeoNode.zip` Download](https://github.com/kartoza/GeoHosting/tree/main/docs/src/products/tutorial_data/Tutorial_Data_GeoNode.zip)


<br>

> **Hint:** You can also download your own custom spatial data from the [BBBike Extract Service](https://extract.bbbike.org/).

---

### Uploading Datasets

#### Overview

In GeoNode, **datasets** are the core published resources that represent either **raster** or **vector** spatial data sources. Each dataset can also include metadata, user ratings, and comments. This makes them collaborative and easy to manage within the GeoNode environment.

<br>

You can upload datasets in two ways:

1. **From the All Resources Page:**

     Click **Add Resource** and select **Upload dataset** from the list.

     <br>

2. **From the Datasets Page:**

     Click **New** and select **Upload dataset** from the dropdown.

     <br>

> **Note:** The default maximum upload size in GeoNode is 100 MB. Administrators can increase this limit in the admin panel.

> **Note:** The maximum number of parallel uploads is 5. This setting can also be adjusted by an administrator.

---

#### Exercise

Follow these steps to upload your dataset to GeoNode:

1. On the GeoNode **Homepage**, click the **Datasets** tab.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-12.png" alt="Datasets Tab" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. Click **New** and select **Upload dataset** from the dropdown.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-13.png" alt="Upload Dataset Dropdon" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>     

3. From the **Upload a Dataset** page, click **Select files...** to choose spatial data files from your computer. 

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-14.png" alt="Select Files" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>  

4. From your file explorer, select the file: `Tutorial_Berlin-shp.zip`

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-15.png" alt="Selected Files" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br> 

5. Click **Upload** to begin the dataset upload process.

     <br>

A progress bar will display the upload status and notify you when the upload is complete. When the upload finishes, click the **View** button to open your dataset.

<br>

<div style="text-align: center;">
 <img src="../img/geonode-img-16.png" alt="View Uploaded Datasets" width=auto>
 <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
 Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
 </div>
</div>

---

### Uploading Documents

#### Overview

#### Exercise

1. Go to **Documents** → **New** or **All Resources** → **Add Resource** → **Upload Document**.

![Add Document Resource](./img/geonode-guide-img-20.png)  
![New Document Button](./img/geonode-guide-img-21.png)  
![Document Upload Page](./img/geonode-guide-img-22.png)

2. Choose between uploading:
   - From your **Local File**  
     ![Local File Upload](./img/geonode-guide-img-23.png)
   - As an **External URL**  
     ![External URL Upload](./img/geonode-guide-img-24.png)

---

## Creating a Map

1. Go to **Maps** → **New**, or use **Add Resource** → **Create Map**.
2. Optionally create a map directly from a dataset.

![Create Map from Menu](./img/geonode-guide-img-32.png)  
![Create Map Button](./img/geonode-guide-img-33.png)  
![Map Viewer](./img/geonode-guide-img-34.png)

---

## Sharing & Permissions

1. Go to the resource (dataset, map, or document).
2. Click **Share** → set permissions for:
   - None
   - View Metadata
   - View and Download
   - Edit
   - Manage

![Share Options Form](./img/geonode-guide-img-25.png)  
![Share Settings Example](./img/geonode-guide-img-26.png)

Click **Save** to apply changes.

---

## Finding Data

Use the **Search bar** or filter panel to find resources by:

- Keyword
- Type
- Category
- Owner
- Date
- Extent

![Search Bar](./img/geonode-guide-img-16.png)  
![Search Results](./img/geonode-guide-img-17.png)  
![Extent Filter](./img/geonode-guide-img-18.png)  
![Sort Options](./img/geonode-guide-img-19.png)

---

## Other Useful Features

- **GeoStories**  
  Create immersive narratives with text, maps, videos, and images.

- **Dashboards**  
  Build analytical views using maps, charts, and counters.

---

## Need More Help?

Visit the official GeoNode documentation:  
**[https://docs.geonode.org/en/master/](https://docs.geonode.org/en/master/)**

---

© 2024 Kartoza. Licensed under the GNU AGPL v3.