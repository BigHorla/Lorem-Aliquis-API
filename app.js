//Imports
const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');

//Imports [SECURITY]
const helmet = require('helmet');

//-----------------------------------------------------
//CORS
app.use(cors());

//-----------------------------------------------------
//Middleware utilitaires
app.use(helmet());// Hide Express in request headers
app.use(express.json());//Pour parser les requètes
app.use("/img", express.static("img")); 

//-----------------------------------------------------
//AVATAR ROUTES
const avatarRoutes = require('./routes/avatar_Route')
app.use('/', avatarRoutes);

//-----------------------------------------------------
//Exports
module.exports = app;