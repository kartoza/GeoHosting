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

# System architecture

## BIMS Architecture

![Architecture](img/bims-architecture.png)

| Logo | Name | Notes |
|------------|---------|----------------|
| ![GeoServer](img/architecture-geoserver.png){: style="height:30px;width:30px"} | [GeoServer](http://geoserver.org) | An open-source server written in Java that allows users to share, process and edit geospatial data. GeoServer implements industry-standard OGC protocols such as Web Feature Service (WFS), Web Map Service (WMS), and Web Coverage Service (WCS). Additional formats and publication options are available as extensions, including Web Processing Service (WPS) and Web Map Tile Services (WMTS). |
| ![Django](https://static.djangoproject.com/img/logos/django-logo-negative.svg){: style="height:30px;width:30px"} | [Django](https://www.djangoproject.com/) | BIMS is based on Django, which is a high-level python web framework. Django follows the model-template-views architecture pattern. |
| ![Celery](img/architecture-celery.svg){: style="height:30px;width:30px"} | [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html) | Celery is a simple, flexible, and reliable distributed system to process vast amounts of messages, while providing operations with the tools required to maintain such a system. It’s a task queue with focus on real-time processing, while also supporting task scheduling. BIMS uses Celery for handling background tasks. |
| ![PostgreSQL](img/architecture-postgresql.png){: style="height:30px;width:30px"} | [PostgreSQL](https://www.postgresql.org/) | PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. PostgreSQL helps to make up the database that stores and manages both the spatial data and information for BIMS. |
| ![PostGIS](img/architecture-postgis.svg){: style="height:30px;width:30px"} | [PostGIS](https://postgis.net/) | PostGIS extends the capabilities of the PostgreSQL relational database by adding support storing, indexing and querying geographic data. PostGIS helps to make up the database that stores and manages both the spatial data and information for BIMS. |
| ![OpenLayers](img/architecture-openlayers.png){: style="height:30px;width:30px"} | [OpenLayers](https://openlayers.org/) | OpenLayers makes it easy to put a dynamic map in any web page. It can display map tiles, vector data and markers loaded from any source. OpenLayers has been developed to further the use of geographic information of all kinds. It is completely free, Open Source JavaScript, released under the 2-clause BSD License (also known as the FreeBSD). It is used for map interactions and geospatial operations in BIMS. |
| ![Backbone.js](https://backbonejs.org/docs/images/backbone.png){: style="height:30px;width:30px"} | [Backbone.js](https://backbonejs.org/) | Backbone.js is a JavaScript rich-client web app framework based on the model–view–controller design paradigm. BIMS uses it to provide specific front-end functionality.. |
| ![CSS](img/architecture-css.png){: style="height:30px;width:30px"} | Cascading Style Sheets | CSS is a style sheet language used for describing the presentation of the page HTML in BIMS. |

## Software Architecture Overview

### Python/Django

BIMS is written with Django. It includes few apps to build the user interfaces. Several Python libraries are used
in BIMS to realize its specific functionality.

#### BIMS Apps

* `bims`: BIMS core functionality

    Stores the core functionalities used in the ensemble of the BIMS application

* `td_biblio`: Bibliography

    Manages the bibliography in BIMS

* `scripts`: BIMS scripts

    Series of commands used to automatically manipulate (manage, remove, clean, or add) data in BIMS

* `bims_theme`: BIMS theme

    Manages the BIMS theme, like the logo, the section in landing page, and the menu.

* `mobile`: API for BIMS mobile application

    Stores the functionalities used in the BIMS mobile application

#### BIMS Modules

* Taxonomy
* SASS
* Physico-chemistry
* Water Temperature

#### Libraries

There are multiple Python libraries used in BIMS, like:

* Django REST framework

    BIMS provides Web APIs by using the [django rest framework](https://www.django-rest-framework.org/)

    `bims.api_views`

    `bims.api_urls.py`

* Celery

    BIMS uses [celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html) for handling background
tasks.

    `bims.tasks`

### JavaScript

BIMS uses several JavaScript libraries to provide specific functionality in the front-end. They are found at
`bims/static/js/libs`

* **Backbone.js**: used in the map filters
* **Highcharts**: used for the charts
* **OpenLayers**: used for the web mapping

### Settings

The Django settings for BIMS can be found in `core.settings`

### Docker/docker-compose

### Testing Framework

`bims/tests`: Tests are used to test separate units of the written code and to determine if the code works as expected.

BIMS uses [factory_boy](https://factoryboy.readthedocs.io/en/stable/) library for test framework.

## Data Model

[//]: # (&#40;detailed walkthrough of the data model covering biological, abiotic, sass, etc parts of the data model too - )

[//]: # (break down to enough high level sections&#41;)

A [model](https://docs.djangoproject.com/en/3.0/topics/db/models/) is the single, definitive source of information about
your data. It contains the essential fields and behaviors of the data that you’re storing. Generally, each model maps to a
single database table.

As a platform for managing and visualizing biodiversity data, the following models are often used in BIMS:

### `bims.models.biological_collection_record`

### `bims.models.taxonomy`

### `bims.models.location_site`
