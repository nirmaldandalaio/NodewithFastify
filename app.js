/****************/

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})

// Import Swagger Options
const swagger = require('./config/swagger')
// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options)

//Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the DB");
}).catch(err => {
    console.log("Could not connect to the DB");
    process.exit();
})
  
// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

//app.use('/scripts', express.static(__dirname + '/scripts'));

//Require Users routes
const routes = require('./app/routes/carroutes.js')

routes.forEach((route, index) => {
    fastify.route(route)
})
  
// Run the server!
const start = async () => {
try {
    await fastify.listen(3000)
    fastify.swagger()
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
}
start()