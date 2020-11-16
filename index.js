const express = require('express');
const app = express();
const { dbConnection } = require('./config/database');
//----------------------------------------------
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
//----------------------------------------------
var  cron  = require ( './node_modules/node-cron' ) ;
var  schedule = require ('./node_modules/node-schedule');
const { config } = require('./config/index');
const routesApi = require('./routes/routes.js');
const routesUserApi = require('./routes/routesUsers.js');
const routesClientApi = require('./routes/routesClients');
const routesCampaignsApi = require('./routes/routesCampaign');
//const routesListApi = require('./routes/routesLists');
const routesBlackApi= require('./routes/routesBlack');
const cors = require('cors')
var fileupload = require("express-fileupload");
var demo = '2020, 10, 14, 01, 04, 0';
var date = new Date(2020, 10, 14, 01, 06, 0);

//body parser
app.use(express.json());
app.use(cors());

app.use(fileupload());

dbConnection();
app.use(express.static('public'));
app.use('/api/listas', require('./routes/listas'));
app.use('/api/blacks', require('./routes/blacks'));

routesApi(app);
routesUserApi(app);
routesClientApi(app);
routesCampaignsApi(app);
//routesListApi(app);
//routesBlackApi(app);

 



app.listen(config.port, function() {
    console.log(`Listening http://localhost:${config.port}`);
       schedule.scheduleJob(date, function(){
        const now = new Date();
        console.log('Hola schedule ${now.toLocaleString()}');
     
      });
});




module.exports = app;