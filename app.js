'use strict'

// VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

// IMPORTACION RUTAS
const usuariorutas = require("./src/rutas/usuario.rutas");

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/api', usuariorutas);

// EXPORTAR
module.exports = app;     