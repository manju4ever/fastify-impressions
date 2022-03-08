const { test } = require("tap");
const plugin = require("./");

test("Plugin Registration Check", (t) => {
  return t.resolves(require("fastify")().register(plugin));
});

test("Check impression counts for index route", async (t) => {
  const app = require("./server")({
    logger: false,
  });
  test("Single hit of index route", async (t) => {
    await app.inject({
      method: "GET",
      path: "/",
    });
    const res = await app.inject({
      method: "GET",
      path: "/fastify-impressions/json",
    });
    t.equal(res.json()["/"], 1);
  });
  test("Double hit of index route", async (t) => {
    await app.inject({
      method: "GET",
      url: "/",
    });
    const res = await app.inject({
      method: "GET",
      url: "/fastify-impressions/json",
    });
    t.equal(res.json()["/"], 2);
  });
});

test("Check impressions for parameterized routes", async (t) => {
  const app = require("./server")({ logging: false });
  await app.inject({
    method: "GET",
    url: "/profile/manju",
  });
  const res = await app.inject({
    method: "GET",
    path: "/fastify-impressions/json",
  });
  t.notOk(res.json()["/"]);
  t.equal(res.json()["/profile/manju"], 1);
});
