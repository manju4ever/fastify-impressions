# fastify-impressions

[![fastify-impressions](https://github.com/manju4ever/fastify-impressions/actions/workflows/testing.js.yml/badge.svg?branch=main)](https://github.com/manju4ever/fastify-impressions/actions/workflows/testing.js.yml)

> Plugin to track impressions based on route(s)

<!-- toc -->
- [fastify-impressions](#fastify-impressions)
  - [Install](#install)
  - [Usage](#usage)
  - [Plugin Options](#plugin-options)
  - [License](#license)

<!-- tocstop -->

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
    trackSuccessOnly: false // track only success responses
  })
  .catch(console.error);

fastify.listen(8080, (err, address) => {
  console.debug("Server started at:", address);
});
```

To see the impressions of the respective routes, access the `/fastify-impressions`, and this should return a JSON response

## Plugin Options

- `blacklist` `<Array>`
  - A list of URL's that should not be tracked
- `trackSuccessOnly` `<Boolean>`
  - Enable this flag to track success responses only (200 series)

## License

Licensed under ISC
