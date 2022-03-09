# fastify-impressions
[![fastify-impressions](https://github.com/manju4ever/fastify-impressions/actions/workflows/testing.js.yml/badge.svg?branch=main)](https://github.com/manju4ever/fastify-impressions/actions/workflows/testing.js.yml)


## Plugin to track impressions based on route


<!-- toc -->
- [Install](#install)
- [Usage](#usage)


## Install
```bash
npm i fastify-impressions
```


## Usage
```js
const fastify = require("fastify")({ logging: false });
const fastifyImpressions = require("fastify-impressions");

fastify.register("fastifyImpressions").catch(console.error);

```
