const fastify = require("fastify");

module.exports = function build(opts) {
  const app = fastify(opts);

  app.register(require("./"));

  app.get("/", (req, reply) => reply.send("hello"));

  app.get("/profile/:name", (req, reply) =>
    reply.send(`Hello ${req.params.name}`)
  );
  return app;
};
