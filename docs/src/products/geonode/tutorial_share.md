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

# Sharing Resources

## Overview

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

## Exercise

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

# Need More Help?

Visit the official GeoNode documentation:

- **[https://docs.geonode.org/en/master/](https://docs.geonode.org/en/master/)**

---

© 2024 Kartoza. Licensed under the GNU AGPL v3.