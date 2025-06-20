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

# Tutorial

## Overview

**GeoNode** is a powerful platform for the management and publication of geospatial data. It integrates mature, stable open-source software projects under a user-friendly interface.

With GeoNode's **simplified architecture**, non-specialized users can easily share geospatial data and create interactive maps without advanced GIS skills.

<br>

### Geospatial Data Storage

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

### Data Mixing and Map Creation

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

### GeoNode as a Building Block

GeoNode’s modular, Django-based design makes it highly extendable. Many open-source projects build on GeoNode by reusing its components.

You can explore real-world implementations in the [GeoNode Projects Gallery](https://geonode.org/gallery/).

The GeoNode development community is active, welcoming, and highly supportive of new contributors, providing guidance and ideas to help newcomers get started.

<br>

> **Note:** For more details, refer to the [GeoNode Basics](https://docs.geonode.org/en/master/start/index.html#geonode-basics) section of the official GeoNode documentation.

---

## Data Preperation

### Overview

This tutorial uses an extract of the Berlin city center buildings map from the **BBBike OpenStreetMap extracts**. Download the **Tutorial Data** using the link below:

- [`Tutorial_Data_GeoNode.zip` Download](https://github.com/kartoza/GeoHosting/tree/main/docs/src/products/tutorial_data/Tutorial_Data_GeoNode.zip)


<br>

> **Hint:** You can also download your own custom spatial data from the [BBBike Extract Service](https://extract.bbbike.org/).

---

# Need More Help?

Visit the official GeoNode documentation:

- **[https://docs.geonode.org/en/master/](https://docs.geonode.org/en/master/)**

---

© 2024 Kartoza. Licensed under the GNU AGPL v3.