const fp = require("fastify-plugin");
const counter = {};

function FastifyImpressions(instance, options, done) {
  try {
    // Add a hook to count impressions
    instance.addHook("onRequest", (request, reply, done) => {
      if (!counter[request.url]) counter[request.url] = 1;
      else counter[request.url] += 1;
      done();
    });

    // Add a route to get impressions as json
    instance.get("/fastify-impressions/json", (request, reply) =>
      reply.send(counter)
    );
    done();
  } catch (err) {
    return err;
  }
}

module.exports = fp(FastifyImpressions);
