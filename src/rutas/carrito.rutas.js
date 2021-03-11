'use strict'

const express = require("express");
const carritoController = require("../controladores/carrito.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.put('/agregarProductoCarrito/:productoID', md_authenticated.ensureAuth, carritoController.agregarProductoCarrito);

module.exports = api;   