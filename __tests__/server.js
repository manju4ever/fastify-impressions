const fastify = require("fastify");
const plugin = require("../");

module.exports = function build(fastifyOpts = {}, fastifyImpressionOpts = {}) {
  const app = fastify(fastifyOpts);

  app.register(plugin, fastifyImpressionOpts);

  app.get("/", (req, reply) => reply.send("hello"));

  app.get("/profile/:name", (req, reply) =>
    reply.send(`Hello ${req.params.name}`)
  );

  app.get("/success", (req, reply) => reply.status(200).send("Success !"));

  app.get("/error", (req, reply) => reply.status(401).send("Error !"));

  return app;
};
