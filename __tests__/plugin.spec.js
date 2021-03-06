const { test } = require("tap");
const plugin = require("../");
const DemoServer = require("./server");

const RESULTS_URL = "/fastify-impressions";

test("Plugin Registration Check", (t) => {
  return t.resolves(require("fastify")().register(plugin));
});

test("Check impression counts for index route", async (t) => {
  const app = DemoServer({
    logger: false,
  });
  test("Single hit of index route", async (t) => {
    await app.inject({
      method: "GET",
      path: "/",
    });
    const res = await app.inject({
      method: "GET",
      path: RESULTS_URL,
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
      url: RESULTS_URL,
    });
    t.equal(res.json()["/"], 2);
  });
});

test("Check impressions for parameterized routes", async (t) => {
  const app = DemoServer({ logging: false });
  await app.inject({
    method: "GET",
    url: "/profile/manju",
  });
  const res = await app.inject({
    method: "GET",
    path: RESULTS_URL,
  });
  t.notOk(res.json()["/"]);
  t.equal(res.json()["/profile/manju"], 1);
});

test("Multiple hits on the parameterized routes", async (t) => {
  const app = DemoServer({ logger: false });
  await Promise.all([
    app.inject({
      method: "GET",
      url: "/profile/manju",
    }),
    app.inject({
      method: "GET",
      url: "/profile/manju",
    }),
    app.inject({
      method: "GET",
      url: "/",
    }),
  ]);
  const res2 = await app.inject({
    method: "GET",
    path: RESULTS_URL,
  });
  t.match(res2.json()["/profile/manju"], 2);
  t.match(res2.json()["/"], 1);
});

test("The impression count URL should not be tracked", async (t) => {
  const server = DemoServer({ logger: false });

  await server.inject({
    method: "GET",
    url: "/",
  });
  const res = await server.inject({
    method: "GET",
    url: RESULTS_URL,
  });

  t.notOk(res.json()[RESULTS_URL]);
});

test("Add a new route and blacklist the same", async (t) => {
  const server = DemoServer(
    {
      logger: false,
    },
    {
      blacklist: ["/notrack"],
    }
  );
  server.get("/notrack", (req, reply) => {
    return reply("Not to be tracked !");
  });
  await server.inject({
    method: "GET",
    url: "/notrack",
  });
  const res = await server.inject({
    method: "GET",
    url: RESULTS_URL,
  });
  t.notOk(res.json()["/notrack"]);
});

test("Check count for success response and ignore error routes", async (t) => {
  const server = DemoServer(
    {
      logger: false,
    },
    {
      trackSuccessOnly: true,
    }
  );
  await Promise.all([
    server.inject({
      method: "GET",
      url: "/success",
    }),
    server.inject({
      method: "GET",
      url: "/success",
    }),
  ]);
  server.inject({ method: "GET", url: "/error" });
  const res = await server.inject({
    method: "GET",
    url: "/fastify-impressions",
  });
  t.match(res.json()["/success"], 2);
  t.notOk(res.json()["/error"]);
});
