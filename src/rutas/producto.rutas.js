'use strict'


const express = require("express");
const productoController = require("../controladores/producto.controller"); 
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.post('/registrarProducto', md_authenticated.ensureAuth , productoController.registrarProducto);


module.exports = api;   