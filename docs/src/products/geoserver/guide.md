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

# GeoServer Guide

> **Note** For installation instructions, refer to GeoServer Installation Guide.

## Using the Kartoza GeoSpatialHosting Dashboard

After your service has finished setting up, you will be redirected to the Hosted Services page of the GeoSpatial Hosting Dashboard. Here, you can view all your purchased services.

![GeoSpatialHosting Dashboard](./img/geoserver-img-4.png)

<br>

**To access your login credentials:**

1. Click the Get Credentials button under your Hosted Service.

2. Your credentials will be copied to your clipboard.

     > **Hint** Paste and save your credentials in a secure location.

3. Click the application name you selected for your GeoServer instance to open it.

     <br>

     ![Hosted Services](./img/geoserver-img-5.png)

## Getting Started

### Using the web administration interface

GeoServer includes a browser-based web administration interface that allows users to configure all aspects of the server — from adding and publishing data to adjusting service settings.

<br>

You can access the interface in two ways:

1. **Via direct URL**

     Open your browser and navigate to:

     ```
     http://<application_name>.sta.do.kartoza.com/geoserver
     ```

2. **Via the GeoSpatial Hosting Dashboard**

     Click the application name you selected for your GeoServer instance.

<br>

Once opened, the interface displays the Welcome page, which includes links to GeoServer’s various web services. These service URLs can be copied and pasted into desktop GIS software (e.g. QGIS), mobile apps, and web mapping applications. This allows your spatial data to be served and consumed in multiple environments.

![Welcome Page](./img/geoserver-img-6.png)

<br>

> **Note:** For more details, refer to the Welcome section of the official GeoServer documentation.

<br>

### Logging In

To modify server settings or configure spatial data in GeoServer, you must first log in using the administrator credentials.

<br>

**To log in:**

1. Navigate to the top-right corner of the web interface.

2. Click the Login button.

3. Enter the credentials you generated earlier from the GeoSpatialHosting Dashboard:

     - **Username:** `admin`
     - **Password:** `GeoServer_Admin_Password`

     <br>

     ![Login](./img/geoserver-img-7.png)

     <br>

     > **Hint** Need help finding your credentials? See the section: [Using the Kartoza GeoSpatialHosting Dashboard](http://127.0.0.1:8000/products/geoserver/guide/#using-the-kartoza-geospatialhosting-dashboard)

     > **Note:** You can change login details later under the [Security](https://docs.geoserver.org/latest/en/user/security/index.html#security) section of the GeoServer documentation.

<br>

Once logged in, the Welcome screen expands to show administrative functions — these are primarily accessible through the navigation menu on the left-hand side.

![Additional options when logged in](./img/geoserver-img-8.png)

<br>

### Layer Preview

The [Layer Preview](https://docs.geoserver.org/latest/en/user/data/webadmin/layerpreview.html#layerpreview) page provides a quick way to view the output of published layers.

1. Click the **Layer Preview** link in the menu to access this page.

     <br>

     ![Layer Preview List](./img/geoserver-img-9.png)
   
     <br>

2. Locate the layer you want to preview and click a link under the desired output format. For example,  clicking the **OpenLayers** link will display a preview of that layer.
   
     <br>

3. To sort any column alphabetically, simply click on the column header.

     <br>

     ![Unsorted (left) and sorted (right) columns](./img/geoserver-img-10.png)

     <br>

4. Use the search box to filter the list of items — especially helpful when working with data types that include many layers. Enter your search term and press **Enter**. GeoServer will display a filtered list of items matching your query.

     <br>

     ![Search results for the query “countries” on the Workspace page](./img/geoserver-img-11.png)

     <br>

> **Hint** For an exact match, enclose your search term in quotes or double quotes. For instance, `ads` would match `roads`, but `"ads"` would only match the exact term.

<br>

> **Note** Sorting and searching functions are available on all data configuration pages..

> **Note** For additional details, see the full [Layer Preview documentation](https://docs.geoserver.org/latest/en/user/data/webadmin/layerpreview.html#layerpreview).

<br>

## Publishing a Layer

This tutorial guides you through the steps to publish a layer using GeoServer.

> **Note** This tutorial assumes GeoServer is running at `http://<application_name>.sta.do.kartoza.com/geoserver`.

<br>

### Data Preparation

Before publishing data in GeoServer, we need to gather and prepare a few shapefiles. In this tutorial, we’ll use four small-scale 1:110m datasets from [Natural Earth](https://www.naturalearthdata.com/).

<br>

1. **Download Datasets**

     Click the links below to download the .zip archives containing the shapefiles:

     - [Coastlines](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/physical/ne_110m_coastline.zip)
     - [Countries](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_countries.zip)
     - [Boundary lines](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_admin_0_boundary_lines_land.zip)
     - [Populated places](https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/110m/cultural/ne_110m_populated_places_simple.zip)

     <br>

2. **Organize Files**

     After downloading, unzip each file and move the extracted files into a single folder called: `NaturalEarth`

     <br>

     > **Hint** Keep your folder structure tidy — it’ll help later when uploading or referencing your data in GeoServer.

<br>

### Adding data to your File Browser

In order for the data to be accessible in the Web Administration Interface, it first needs to be added to your File Browser. 

<br>

**To add data:**

1. Open the file browser at:

     ```
     http://<application_name>.sta.do.kartoza.com/file
     ```

2. Log in using the credentials you retrieved from the GeoSpatialHosting Dashboard:

     - **Username:** `admin`
     - **Password:** `FB_Password_Unhashed`

     <br>

     ![File Browser Login](./img/geoserver-img-12.png)

     <br>

      > **Hint** Need help finding your credentials? See the section: [Using the Kartoza GeoSpatialHosting Dashboard](http://127.0.0.1:8000/products/geoserver/guide/#using-the-kartoza-geospatialhosting-dashboard)

      <br>

3. Double-click the `geoserver_user_data` folder to enter it.

4. Click the **Upload** button at the top-right of the screen. When prompted, select Folder.

     <br>

     ![File Browser Upload](./img/geoserver-img-13.png)

     <br>

5. Locate and upload the `NaturalEarth` folder you previously prepared. 

The data will now be accessible in the Web Administration Interface. 

<br>

### Creating a New Workspace

The next step is to create a workspace for your layers. A workspace is essentially a container used to organize and group related layers within GeoServer.

> **Note** This step is optional if you prefer to use an existing workspace. Typically, a new workspace is created for each project, allowing you to group related stores and layers together.

<br>

1. Open a web browser and navigate to:

     ```
     http://<application_name>.sta.do.kartoza.com/geoserver
     ```

     <br>

2. Log in to GeoServer using your credentials.

3. In the left-hand menu, go to **Data → Workspaces**.

     <br>

     ![Workspace](./img/geoserver-img-14.png)

     <br>

4. Click the **Add new workspace** button to open the **New Workspace** page.

5. Complete the form with the following details:

     | Field           | Value                                      |
     |---------------|----------------------------------|
     | Name          | `tutorial`                                |
     | Namespace URI | `http://<application_name>.sta.do.kartoza.com/geoserver/tutorial` |

     <br>
     
     > **Note** The workspace name should describe your project. It must be 10 characters or fewer and cannot contain spaces.

     > **Note** The Namespace URI can be any URL-like string tied to your project. It typically includes a trailing identifier that reflects the workspace. This URI does not need to resolve to a real web address.

     <br>

6. Click the **Save** button.

     <br>

     ![Save](./img/geoserver-img-15.png)

     <br>

7. The `tutorial` workspace should now appear in the **Workspaces** list.

     <br>

     ![Update Workspace list](./img/geoserver-img-16.png)

<br>

### Create a Store

Once the workspace is set up, the next step is to add a new store. A store tells GeoServer how to connect to the data.

<br>

1. Navigate to **Data → Stores**.

     <br>

     ![Store](./img/geoserver-img-17.png)

     <br>

2. To add the GeoPackage, click the **Add new Store** button. This will take you to a list of data sources supported by GeoServer.

     > **Note** Keep in mind that this list is extensible, so yours might look slightly different.

     <br>

3. From the list of **Vector Data Sources**, find and click the **Shapefile** option.

     <br>

     ![Vector Data Sources](./img/geoserver-img-18.png)

     <br>

4. Fill in the following fields:

     | Field             | Value                                         |
     |-------------------|-----------------------------------------------|
     | Workspace         | `tutorial`                                    |
     | Data Source Name  | `Natural Earth - Coastlines`                   |
     | Description       | `Shapefile of Natural Earth Coastlines data`  |

     <br>

5. Under **Shapefile location**, enter the following:

     ```
     file:///files/geoserver_user_data/NaturalEarth/ne_110m_coastline/ne_110m_coastline.shp
     ```

     <br>

     ![New Vector Data Source](./img/geoserver-img-19.png)

     <br>

6. Press **Save**. You will be redirected to the **New Layer** page.

<br>

### Creating a Layer

Now that we've connected to the store, we can proceed to publish a layer.

<br>

1. In the New Layer page, click Publish next to the `ne_110_coastline` layer name.

     <br>
     
     ![New Layer Page](./img/geoserver-img-20.png)

     <br>

2. The Edit Layer page defines the data and publishing parameters for the layer.

     <br>
     
     ![Edit Layer Page](./img/geoserver-img-21.png)

     <br>

3. Three key sections on the Data tab must be completed before saving:

     - **Basic Resource Info** – defines how the layer is presented
     - **Coordinate Reference System** – determines how spatial data is interpreted
     - **Bounding Boxes** – establishes the dataset's geographic extent

     <br>

4. In the Basic Resource Info section, enter the following:

     | Field     | Value             |
     |-----------|-------------------|
     | Name      | `Coastline`       |
     | Title     | `Coastline`       |

     <br>

     > **Note** While GeoServer allows flexible naming, many external protocols require simple, standard layer names.

     <br>

     ![Basic Resource Info Section](./img/geoserver-img-22.png)

     <br>

5. Verify that the Coordinate Reference System (CRS) information is accurate:

     | Field            | Value             |       
     |------------------|-------------------|
     | Native SRS       | EPSG:4326         |
     | Declaired SRS    | EPSG:4326         |
     | SRS Handling     | Force declared    |

     <br>

     ![Coordinate Reference System Section](./img/geoserver-img-23.png)

     <br>

6. In the Bounding Boxes section, click **Compute from data**, then **Compute from native bounds** to auto-fill the bounding box fields.

     <br>

     ![Bounding Boxes Section](./img/geoserver-img-24.png)

     <br>

7. Click Apply to save your progress without closing the page.

     > **Hint** This is useful to confirm that all required fields are correctly filled; GeoServer will show a warning if anything is missing.

     <br>

8. Scroll to the top and go to the Publishing tab.

9. Under WMS Settings, set the Default Style to `line`.

     <br>

     ![WMS Settings](./img/geoserver-img-25.png)

     <br>

10. Click **Save** to finalize the layer configuration and publish the layer.

     <br>

     ![Published Layer](./img/geoserver-img-26.png)

<br>

## Previewing the layer

To confirm that the `tutorial:countries` layer has been published successfully, we can preview it in GeoServer.

1. Go to **Data → Layer Preview** and locate the `tutorial:countries` layer.

    > Note: To filter results and make it easier to find, type `tutorial` in the search field.

    ![](./img/geoserver-img-19.png)

2. Click the OpenLayers link in the Common Formats column.

3. An OpenLayers map will open in a new tab, displaying the shapefile data with the default line style.

4. You can interact with the preview map by zooming, panning, and clicking on features to view their attribute data.

![](./img/geoserver-img-20.png)

# Publishing an Image

This tutorial outlines the process of publishing a World File and accompanying image using GeoServer.

> **Note:** This tutorial assumes GeoServer is accessible at `http://localhost:8080/geoserver`.

## Data Preparation

Begin by gathering the data we will publish.

1. Download the Natural Earth 1:50m Shaded Relief raster from:
    - [Natural Earth Data - 50m Shaded Relief](https://www.naturalearthdata.com/downloads/50m-raster-data/50m-shaded-relief/)

2. The download includes small-scale 1:50m raster data consisting of:
    - `SR_50M.prj`
    - `SR_50M.README.html`
    - `SR_50M.tfw`
    - `SR_50M.tif`
    - `SR_50M.VERSION.txt`

    > **Note** These files together represent a world file (`.tfw`) and its associated image (`.tif`).

3. Move all files into the `data/ne` folder inside your GeoServer Data Directory.

## Creating a New Workspace

Next, we’ll create a workspace to organize the data. A workspace acts as a container for grouping related layers.

> **Note:** This step is optional if you prefer to use an existing workspace. Typically, each project has its own workspace to group related stores and layers.

1. Open a web browser and go to `http://localhost:8080/geoserver`.

2. Log into GeoServer.

3. Navigate to **Data → Workspaces**.

4. Click Add new workspace to open the New Workspace page.

5. Enter the following details:

    - **Name:** `tutorial`
    - **Namespace URI:** `http://localhost:8080/geoserver/tutorial`

    > **Note:** The workspace name should represent your project and must not exceed ten characters or contain spaces.
  
    > **Note:** The Namespace URI is typically a URL associated with your project, followed by an identifier for the workspace. It does not need to point to a live address.

6. Click **Submit**.

7. The `tutorial` workspace will now appear in the Workspaces list.

## Creating a Store

After creating the workspace, the next step is to add a new store. A store tells GeoServer how to access and connect to the image file.

1. Go to **Data → Stores**.

2. TThe Stores page shows existing stores, including their types and associated workspaces.

3. To add the image, click the Add new Store button. You’ll be taken to a list of supported data sources. Note that your list may vary depending on installed extensions.

4. Under Raster Data Sources, click the WorldImage link.

    ![](./img/geoserver-img-21.png)

5. The New Raster Data Source page will open.

6. Fill in the Basic Store Info section:

    | workspace | tutorial|
    |-----------|-----------|
    |Data Source Name| ShadedRelief|
    | Description | Grayscale shaded relief of land areas. |

    > **Note:** This information is used internally in GeoServer. Keep the name simple, as it will form part of folder names in the data directory and should comply with your operating system’s character restrictions.

    ![](./img/geoserver-img-22.png)

7. Under Connection Parameters, specify the location of your image:

    - **Database**: `file:data/ne/SR_50M.tif`

8. Click Save.

You will now be redirected to the **New Layer** page to begin publishing your image as a layer.

## Creating a Layer

With the image store created, the next step is to publish it as a layer.

1. On the New Layer page, click Publish next to the `SR_50M` layer name.

2. The Edit Layer page will open, allowing you to define both data and publishing parameters.

3. On the Data tab, complete the three critical sections:

    - **Basic Resource Info** - Describes how the layer appears to users.

    - **Coordinate Reference System (CRS)** - Defines how spatial data aligns with the Earth.

    - **Bounding Boxes** - Determines the spatial extent of the data.

4. Under Basic Resource Info, fill in the following:

    | Name|shaded|
    |---------|---------|
    |Title|Shaded Relief|
    |Abstract|Grayscale shaded relief of land areas.|

    > **Note:** Keep layer names simple. Although GeoServer does not restrict naming, some services may reject complex names.

    ![](./img/geoserver-img-23.png)

5. Ensure the Coordinate Reference System is detected and correct.

6. Under Bounding Boxes, click Compute from SRS bounds and then Compute from native bounds.

    ![](./img/geoserver-img-24.png)

7. Press Apply to save without closing the page.

    > **Note:** This is a good way to check that your information has been entered correctly, GeoServer will provide a warning if any required information is incomplete.

8. Scroll to the top and switch to the Publishing tab.

    ![](./img/geoserver-img-25.png)

9. In the WMS Settings section, make sure the Default Style is set to `raster`.

10. Once complete, click **Save** to finish publishing your layer.

# Publishing a Layer Group

> **Note:** This tutorial assumes that GeoServer is running at `http://localhost:8080/geoserver`.

## Data preparation

Before we can publish a layer group, we need to ensure the required data is available.

Complete the following previous tutorials to prepare the necessary layers:

1. [Publishing a GeoPackage](https://docs.geoserver.org/latest/en/user/gettingstarted/geopkg-quickstart/index.html#geopkg-quickstart) — this defines the `tutorial:countries` layer.

2. [Publishing an Image](https://docs.geoserver.org/latest/en/user/gettingstarted/image-quickstart/index.html#image-quickstart) — this defines the `tutorial:shaded` layer.

## Create a layer group

Now that we have the necessary layers published, we can group them together into a single map view using a layer group.

1. Navigate to the **Data → Layer Groups** page.
   
    ![Layer Groups](./img/geoserver-img-26.png)
   
2. This page displays a list of existing layer groups along with the workspace each belongs to.
   
    > **Note:**  Layer groups can be *global*, allowing you to combine layers from multiple workspaces into one visual representation.

3. At the top of the Layer Groups list, click Add new layer group.

4. The Layer Group editor includes the following sections:

    - **Basic Resource Info** – defines how the layer group is presented externally
    - **Coordinate Reference System** – determines how the data is geospatially projected
    - **Bounding Boxes** – indicates the spatial extent of the group
    - **Layers** – lists the individual layers included, in the order they are drawn

5. Under Basic Resource Info, fill in the following:

    | Name    | `basemap` |
    |---------|-----------|
    | Title   | `Basemap` |
    | Abstract | `Plain basemap suitable as a backdrop for geospatial data.` |
    | Workspace | `tutorial` |
   
    ![Basic resource information](./img/geoserver-img-27.png)

6. Scroll down to the Layers list, which will initially be empty.

7. Click Add Layer, and select the `tutorial:shaded` layer first. The raster should be drawn first, as other content will be shown over top of it.

8. Click Add Layer again, and select the `tutorial:countries` layer. This polygon layer will be rendered on top of the shaded relief.

9. In the layer list, find the `tutorial:countries` entry, and click on its *Style* field. Change it from `polygon` to `line`. This ensures only the outlines of countries are drawn, allowing the shaded relief underneath to remain visible.

    ![Layer group layers in drawing order](./img/geoserver-img-28.png)

10. Scroll to Coordinate Reference System, and click Generate Bounds. Now that the layers are listed, GeoServer can determine the spatial extent and reference system automatically.
    
    ![Coordinate Reference Systems](./img/geoserver-img-29.png)

11. Click **Save** to finish creating your layer group.

# Publishing a style

This tutorial walks through the steps of defining a style and associating it with a layer for use.

> **Note** This tutorial assumes that GeoServer is running at `http://localhost:8080/geoserver`.

## Create a style

1. Navigate to **Data → Style** page.

    ![Styles](./img/geoserver-img-30.png)

2. This page lists existing styles, along with their associated workspaces.

    > **Note** Styles can be *global*, which means they can be defined once and applied to layers across different workspaces.

3. At the top of the Styles list, click the Add a new style link.

4. Under Style Data, fill in the following fields:

    | Name       | Value          |
    |------------|---------------|
    | Name       | `background`   |
    | Workspace  | `tutorial`     |
    | Format     | `SLD`          |

    ![Style Data](./img/geoserver-img-31.png)

5. Next, locate Style Content and under Generate a default style, select `Polygon`.
  
    ![Style Content](./img/geoserver-img-32.png)

6. Click the Generate link to automatically populate the style editor with a basic polygon style outline.

    ![Generate](./img/geoserver-img-33.png)

7. Press Apply to save and define this style. Once saved, additional interactive editing options will become available.

8. Switch to the Publishing tab.

    - Use the search field to filter by `tutorial` and locate the `tutorial:countries` layer.
    - Check the **Default** checkbox next to `tutorial:countries` to set the `tutorial:background` style as the default for this layer.

    ![Style Publish](./img/geoserver-img-34.png)

9. Go to the Layer Preview tab. Under Preview on layer, click the link for `tutorial:countries` to use this dataset while editing the style.

    ![Layer Preview](./img/geoserver-img-35.png)

10. Edit your style by inserting a `fill-opacity` value of `0.25` to make the fill semi-transparent.

    ```xml
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <StyledLayerDescriptor version="1.0.0"
      xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"
      xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

      <NamedLayer>
        <Name>background</Name>
        <UserStyle>
          <Title>Background</Title>
          <FeatureTypeStyle>
            <Rule>
              <Title>Background</Title>
              <PolygonSymbolizer>
                <Fill>
                  <CssParameter name="fill">#444433</CssParameter>
                  <CssParameter name="fill-opacity">0.25</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">0.25</CssParameter>
                </Stroke>
              </PolygonSymbolizer>
            </Rule>
          </FeatureTypeStyle>
        </UserStyle>
      </NamedLayer>
    </StyledLayerDescriptor>
    ```

11. Press **Apply** to update the style and observe the visual change in the layer preview.

For more information you can go with [Official docs](https://docs.geoserver.org/latest/en/user/)
