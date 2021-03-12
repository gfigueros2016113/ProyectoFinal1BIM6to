'use strict'

// VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

// IMPORTACION RUTAS
const usuariorutas = require("./src/rutas/usuario.rutas");
const adminrutas = require("./src/rutas/admin.rutas");
const productorutas = require('./src/rutas/producto.rutas');
const categoriarutas = require('./src/rutas/categoria.rutas');
const carritorutas = require('./src/rutas/carrito.rutas');
const facturarutas = require('./src/rutas/factura.rutas');

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use('/api', usuariorutas, adminrutas, productorutas, categoriarutas, carritorutas, facturarutas);

// EXPORTAR
module.exports = app;     