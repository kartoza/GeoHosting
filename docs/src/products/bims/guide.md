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

# Bims Guide

## Key concepts

**Site**: A specific location along a river course where sampling or assessments take place.

![Key Concepts 1](./img/key-concepts-1.png)

**FBIS Site-code**: A unique name given to each site made up of:

* Two characters representing the secondary catchment code e.g. G1
* Four characters representing the river name e.g. JONK. This is currently derived from the 1:500 000 DWS rivers layer. If the river does not have a name on this layer, then the nearest river name is taken. For this reason it is important for a user to add the Original river name on the Site form if the river is unnamed (e.g. a small tributary).
* A hyphen i.e. –
* Five characters representing the nearest place name e.g. SIMONS. In many cases these five characters are replaced by a numeric value where a place name has not been identified. The Original Site Code and Original River Name from the original study are also provided.
* The site code is generated automatically unless the user as a standard name.

  ![Key Concepts 2](./img/key-concepts-2.png)

**River**: This is currently derived from the 1:500 000 DWS rivers layer. If the river does not have a name on this layer, then the nearest river name is taken. For this reason it is important for a user to add the Original river name on the Site form if the river is unnamed (e.g. a small tributary). (See section 11.1 Create a site).

**Occurrence record**: One collection record for a taxon at a given site. This record may optionally include abundance data.

![Key Concepts 3](img/key-concepts-3.png)

**Search**: The process whereby free-form text is entered into the search box and the matching records are shown on the map.

![Key Concepts 4](img/key-concepts-4.png)

**Filters**: Often used in conjunction with search, filtering allows you to narrow down the result set based on predefined spatial, temporal and biological criteria, such as province, date, species, etc.

![Key Concepts 5](img/key-concepts-5.png)

**Biodiversity Module**: A higher taxonomic grouping of taxa (and thus their related collection records). Modules can have their own dashboard implementations and data capture forms to capture information specific to the kind of taxa in the module grouping.

![Key Concepts 6](img/key-concepts-6.png)

**Abiotic Module**: A module serving abiotic data including water temperature time series data and physico-chemical data.

![Key Concepts 7](img/key-concepts-7.png)

## Signing up

Visit [freshwaterbiodiversity.org](https://freshwaterbiodiversity.org/) to login, sign up and explore. Complete the **Sign Up** to register to use FBIS, including details of your organisation and role in the freshwater community.

![Sign Up 1](img/sign-up-1.png)

![Sign Up 2](img/sign-up-2.png)

## Logging in

Navigate to [freshwaterbiodiversity.org](https://freshwaterbiodiversity.org/), and then on the landing page click on **Log In** in the top navigation bar.

![Logging In 1](img/logging-in-1.png)

You will be redirected to the Login Page. Fill in your email address and password and then click on **Login**

![Logging In 2](img/logging-in-2.png)
