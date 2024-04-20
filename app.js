const app = require('./config/express');
const config = require('./config/serverConfig');
const db = require('./config/mongo')

app.listen(config.port,()=>{
    console.log('server started on port ' + config.port);
});

module.exports = app;