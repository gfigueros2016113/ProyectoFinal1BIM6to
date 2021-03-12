'use strict'

const express = require("express");
const facturaController = require("../controladores/factura.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.get('/productosAgotados', md_authenticated.ensureAuth, facturaController.productosAgotados);
api.get('/obtenerFactura', md_authenticated.ensureAuth, facturaController.obtenerFactura);
api.get('/obtenerProductosMasVendidos', md_authenticated.ensureAuth, facturaController.obtenerProductosMasVendidos);
api.get('/obtenerFacturasUsuario', md_authenticated.ensureAuth, facturaController.obtenerFacturasUsuario);
api.get('/obtenerProductosFactura/:facturaID', md_authenticated.ensureAuth, facturaController.obtenerProductosFactura);

module.exports = api;   