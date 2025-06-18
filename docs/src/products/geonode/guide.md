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

<br>

> **Note:** For more details, refer to the [Managing Datasets](https://docs.geonode.org/en/master/usage/managing_datasets/index.html#managing-datasets) section of the official GeoNode documentation.

---

### Uploading Documents

#### Overview

GeoNode allows users to share a wide variety of **documents**, such as:

<br>

| **Document Type**                 | **Supported File Types**               |
| --------------------------------- | -------------------------------------- |
| **Reports**                       | .doc, .docx, .txt, .odt                |
| **Conceptual Notes**              | .doc, .docx, .txt, .odt                |
| **Posters**                       | .pdf, .jpg, .png, .tif, .tiff          |
| **Spreadsheets**                  | .xls, .xlsx, .ods                      |
| **Presentations**                 | .ppt, .pptx, .odp                      |
| **Images**                        | .gif, .jpg, .png, .tif, .tiff          |
| **PDFs**                          | .pdf                                   |
| **Zip Files**                     | .rar, .zip, .gz                        |
| **Styled Layer Descriptor (SLD)** | .sld                                   |
| **Metadata Files**                | .xml, .qml                             |
| **External URLs**                 | Web resource links (no file extension) |

<br>

> **Note:** Only authenticated (logged-in) users can upload documents to GeoNode.

<br>

You can upload documents in two ways:

1. **From the All Resources Page:**

     Click **Add Resource** and select **Upload document** from the list.

     <br>

2. **From the Documents Page:**

     Click **New**.

     <br>

> **Note:** The default maximum upload size in GeoNode is 100 MB. Administrators can increase this limit in the admin panel.

> **Note:** The maximum number of parallel uploads is 5. This setting can also be adjusted by an administrator.

---

#### Exercise

Follow these steps to upload your document to GeoNode:

1. On the GeoNode **Homepage**, click the **Documents** tab.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-17.png" alt="Documents Tab" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. Click the **New** button.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-18.png" alt="New Document Button" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>     

3. The **Document Upload** page offers two ways to add documents to GeoNode:

     - Upload from a local file
     - Add a reference to an external URL

     <br>

4. Click **Select files...** to choose data files from your computer. 

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-19.png" alt="Select Files" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>  

5. From your file explorer, select the file: `README.txt`

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-20.png" alt="Selected Files" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br> 

5. Click **Upload** to begin the document upload process.

     <br>

Once the upload is complete, click **View** to open the document’s detail page. Here you can see additional information, edit metadata, share the document, download the file, and delete the document.

<br>

<div style="text-align: center;">
 <img src="../img/geonode-img-21.png" alt="View Uploaded Document" width=auto>
 <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
 Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
 </div>
</div>

<br>

> **Note:** For more details, refer to the [Managing Documents](https://docs.geonode.org/en/master/usage/managing_documents/index.html#managing-documents) section of the official GeoNode documentation.

---

### Creating a Map

#### Overview

Maps are **collections of datasets** displayed together on an **interactive web map**. These maps can be composed using the map composer and saved as GeoNode resources. Additionally, maps can be enriched with metadata, ratings, and user comments.

<br>

You can create map in three ways:

1. **From the All Resources Page:**

     Click **Add Resource** and select **Create map** from the list.

     <br>

2. **From the Maps Page:**

     Click **New**.

     <br>

3. **From the Datasets Page:**

     Click **View** and select **Create map**.

     <br>

When you create a new map, it will automatically open in the **Map Viewer**. In the upper left corner, you’ll find the **TOC (Table of Contents)** button. This opens the TOC panel, where you can manage all the datasets associated with the map. 

<br>

---

#### Exercise

Follow these steps to create a map in GeoNode:

1. On the GeoNode **Homepage**, click the **Maps** tab.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-22.png" alt="Maps Tab" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. Click the **New** button.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-23.png" alt="New Map Button" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>     

3. In the **Map Viewer**, click **Add Dataset** from the top-navigation bar. 

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-24.png" alt="Add Dataset Button" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

4. In the **Datasets Catalog** pane, select your previously uploaded `buildings` layer.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-25.png" alt="Add Dataset" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

5. Under the **Resources** link in the top-navigation toolbar, select **Save As**.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-26.png" alt="Save As" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

6. In the **Save** pop-up, give your map a **Title** and **Description**

     <br>

You should now see your map listed on the **All Resources** page. 

<br>

<div style="text-align: center;">
 <img src="../img/geonode-img-27.png" alt="New Map" width=auto>
 <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
 Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
 </div>
</div>

<br>

> **Note:** For more details, refer to the [Managing Maps](https://docs.geonode.org/en/master/usage/managing_maps/index.html#managing-maps) section of the official GeoNode documentation.

---

### Sharing Resources

#### Overview

GeoNode encourages users to publicly share and make information available for download on the platform. By default, resources are visible and accessible to everyone, but owners can restrict access to specific users or groups as needed.

For **datasets**, anyone can view them by default, but only the dataset owner can edit or manage them.

**Map** sharing offers more advanced permission control. Administrators can define who can perform specific actions on each map, while regular users can manage only the maps they own or those they have been authorized to manage.

<br>

From the **Share Options Settings** panel of each resource, the following sharing options are available:

<br>

| **Permission** | **Document**                                                                        | **Dataset**                                                                          | **Map**                                                                          |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **None**     | The document is not visible to anyone.                                              | *Not applicable.*                                                                    | *Not applicable.*                                                                |
| **View**     | View Metadata: Users can view the document’s metadata.                              | Users can view the dataset.                                                          | Users can view the map.                                                          |
| **Download** | View and Download: Users can view and download the document.                        | Users can view and download the dataset.                                             | Users can view and download the map.                                             |
| **Edit**     | Users can modify the document’s metadata and attributes.                            | Users can modify the dataset’s metadata, attributes, feature properties, and style.  | Users can modify the map’s metadata.                                             |
| **Manage**   | Users can update, delete, change share options, and publish/unpublish the document. | Users can update, delete, adjust sharing options, and publish/unpublish the dataset. | Users can update, delete, adjust sharing options, and publish/unpublish the map. |

---

#### Exercise

Follow these steps to share you map:

1. On the **All Resources** page, click **View** under your `Berlin Buildings` map. 

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-28.png" alt="All Resources" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. In the top-navigation bar, under the **Resource** menu, select **Share**.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-29.png" alt="Share Button" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>     

3. The **Share with people and groups** page will open.

     <br>

4. Update the following sharing permissions:

     - **Anyone:** `View`
     - **Registered Members:** `View`

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-30.png" alt="Share Permissions" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>      

5. Under the **Resources** menu, select **Save**.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-31.png" alt="Save" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

Your map is now public and can be viewed by anyone.

<br>

> **Note:** For more details, refer to the **Share Options** pages of the [Document](https://docs.geonode.org/en/master/usage/managing_documents/document_permissions.html#share-options), [Dataset](https://docs.geonode.org/en/master/usage/managing_datasets/dataset_permissions.html#share-options) and [Map](https://docs.geonode.org/en/master/usage/managing_maps/map_permissions.html#share-options) sections of the official GeoNode documentation.

---

### Finding Data

#### Overview

It is possible to explore GeoNode to find **datasets, maps, documents, and other resource types** by using different navigation paths, filters, and search functions.

On every page, you’ll find a quick search tool. The **Search box** in the navigation bar allows you to type any text and quickly find all resources related to that text. 

When you perform a search, GeoNode takes you to the **Search page**, which displays results across all resource types. The Search page offers powerful options for customizing your search and provides much more precise filtering.  

<br>

You can search and filter data using the following **criteria**:

- Text
- Resource Types (datasets, maps, documents, etc.)
- Categories
- Keywords
- Owners
- Regions
- Groups
- Limitations on Public Access
- Date
- Spatial Extent

<br>

You can **sort search results** by:

- Most Recent
- Less Recent
- Name
- Popularity

<br>

---

#### Exercise

Follow these steps to find specific data:

1. In the **Search Box** on the top navigation bar, type `buildings`.  

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-32.png" alt="Search Box" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>

2. The **Search Page** displays all resources related to your search.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-33.png" alt="Search Page" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br>     

3. Click the **Filter** button and select the checkbox next to **Maps**.

     <br>

     <div style="text-align: center;">
      <img src="../img/geonode-img-34.png" alt="Filters" width=auto>
      <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
      Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
      </div>
     </div>

     <br> 

This allows you to filter the search results to display only maps, helping you refine your results to suit your needs.

<br>

> **Note:** For more details, refer to the [Finding Data](https://docs.geonode.org/en/master/usage/data/finding_data.html#finding-data) section of the official GeoNode documentation.

---

## Other Useful Tools

### Dashboard

**Dashboard** is a **MapStore tool** integrated into GeoNode that provides users with a flexible workspace where they can add multiple widgets such as charts, maps, tables, text, and counters. Dashboards allow users to create interactive connections between these widgets to achieve the following:

- Provide a **visual overview** to better understand a specific data context.
- Enable **spatial and analytical interactions** with the data through widget connections.
- Perform **data analysis** across the included datasets and layers.

<br>

<div style="text-align: center;">
 <img src="../img/geonode-img-35.png" alt="Dashboard" width=auto>
 <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
 Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
 </div>
</div>

<br>

> **Note:** For more details, refer to the [Dashboard](https://docs.geonode.org/en/master/usage/dashboard/index.html#dashboard) section of the official GeoNode documentation.

---

### GeoStories

**GeoStory** is a **MapStore tool** integrated into GeoNode that enables users to create inspiring and immersive stories by combining text, interactive maps, and other multimedia content such as images, videos, or third-party content. This tool makes it easy to tell engaging stories on the web, which can then be published and shared with specific groups of GeoNode users or made public worldwide.

GeoNode allows you to enrich your GeoStory with **internal GeoNode documents and maps** as well as **external sources**. This integration makes GeoStory a highly useful feature for storytelling.

<br>

<div style="text-align: center;">
 <img src="../img/geonode-img-36.png" alt="GeoStory" width=auto>
 <div style="font-size: 0.8em; color: gray; margin-top: 4px;">
 Image credit: <a href="https://geonode.org/" target="_blank">GeoNode</a>
 </div>
</div>

<br>

> **Note:** For more details, refer to the [GeoStroy](https://docs.geonode.org/en/master/usage/geostory/index.html#geostory) section of the official GeoNode documentation.

---

## Need More Help?

Visit the official GeoNode documentation:

- **[https://docs.geonode.org/en/master/](https://docs.geonode.org/en/master/)**

---

© 2024 Kartoza. Licensed under the GNU AGPL v3.