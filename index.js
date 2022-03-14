const fp = require("fastify-plugin");

const defaultOptions = {
  blacklist: ["/favicon.ico", "/fastify-impressions"],
  trackSuccessOnly: false,
};

const impressioner = (config = { blacklist: [] }) => {
  const blacklistMap = new Map(config.blacklist.map((key) => [key, true]));
  const tracker = {};
  function hit(url) {
    if (blacklistMap.has(url)) return false;
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
    const freshOptions = Object.assign({}, defaultOptions, options);
    const counter = impressioner(freshOptions);
    // Add a hook to count impressions
    instance.addHook("onResponse", (request, reply, done) => {
      if (!freshOptions.trackSuccessOnly) {
        counter.hit(reply.request.url);
      }
      if (freshOptions.trackSuccessOnly) {
        if (reply.statusCode >= 200 && reply.statusCode < 300) {
          counter.hit(reply.request.url);
        }
      }
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
    return done(err);
  }
}

module.exports = fp(FastifyImpressions, {
  fastify: "3.x",
  name: "fastify-impressions",
});
