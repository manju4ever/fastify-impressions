const fp = require("fastify-plugin");

const impressioner = (
  config = { blacklist: ["/favicon.ico", "/fastify-impressions/json"] }
) => {
  const { blacklist } = config;
  let tracker = {};
  function hit(url) {
    if (blacklist.indexOf(url) > -1) return false;
    if (!tracker[url]) {
      tracker[url] = 1;
    } else {
      tracker[url] += 1;
    }
    return true;
  }
  function get() {
    return tracker;
  }
  return {
    hit,
    get,
  };
};

function FastifyImpressions(instance, options, done) {
  try {
    const counter = impressioner();
    // Add a hook to count impressions
    instance.addHook("onResponse", (request, reply, done) => {
      counter.hit(reply.request.url);
      done();
    });

    // Add a route to get impressions as json
    instance.get("/fastify-impressions/json", (request, reply) => {
      return reply.send(counter.get());
    });
    done();
  } catch (err) {
    return err;
  }
}

module.exports = fp(FastifyImpressions);
