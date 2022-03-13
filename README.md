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

fastify
  .register("fastifyImpressions", {
    blacklist: [], // specify URL's that are not to be tracked
  })
  .catch(console.error);

fastify.listen(8080, (err, address) => {
  console.debug("Server started at:", address);
});
```

To see the impressions of the respective routes, access the `/fastify-impressions`, and this should return a JSON response
