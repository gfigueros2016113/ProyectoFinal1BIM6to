'use strict'


const express = require("express");
const productoController = require("../controladores/producto.controller"); 
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.post('/registrarProducto/:categoriaID', md_authenticated.ensureAuth , productoController.registrarProducto);
api.get('/obtenerListaProducto', md_authenticated.ensureAuth , productoController.obtenerListaProducto);
api.get('/obtenerProducto/:proID', md_authenticated.ensureAuth, productoController.obtenerProducto);
api.put('/editarStock/:proID', md_authenticated.ensureAuth,productoController.editarStock);
api.delete('/eliminarProducto/:proID', md_authenticated.ensureAuth, productoController.eliminarProducto);
api.put('/editarProducto/:proID', md_authenticated.ensureAuth,productoController.editarProducto);


module.exports = api;   