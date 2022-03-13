const fastify = require('fastify')
const plugin = require('./')

module.exports = function build (fastifyOpts = {}, fastifyImpressionOpts = {}) {
  const app = fastify(fastifyOpts)

  app.register(plugin, fastifyImpressionOpts)

  app.get('/', (req, reply) => reply.send('hello'))

  app.get('/profile/:name', (req, reply) =>
    reply.send(`Hello ${req.params.name}`)
  )
  return app
}
