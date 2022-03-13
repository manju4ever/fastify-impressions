const fp = require("fastify-plugin");

const defaultOptions = {
  blacklist: ["/favicon.ico", "/fastify-impressions"],
};

const impressioner = (config = { blacklist: defaultBlacklist }) => {
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
    let freshOptions;
    if (!!options) {
      freshOptions = Object.assign({}, defaultOptions, options);
    }
    const counter = impressioner(freshOptions);
    // Add a hook to count impressions
    instance.addHook("onResponse", (request, reply, done) => {
      counter.hit(reply.request.url);
      done();
    });

    // Add a route to get impressions as json
    instance.get("/fastify-impressions", (request, reply) => {
      return reply
        .header("Content-Type", "application/json")
        .send(counter.get());
    });
    done();
  } catch (err) {
    return err;
  }
}

module.exports = fp(FastifyImpressions, {
  fastify: "3.x",
  name: "fastify-impressions",
});
