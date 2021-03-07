'use strict'

const express = require("express");
const adminController = require("../controladores/admin.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.post('/registrarUsuario', md_authenticated.ensureAuth,adminController.registrarUsuario);
api.put('/editarRol/:clienteID', md_authenticated.ensureAuth,adminController.editarRol);
api.delete('/eliminarCliente/:clienteID', md_authenticated.ensureAuth, adminController.eliminarCliente);
api.put('/editarCliente/:clienteID', md_authenticated.ensureAuth,adminController.editarCliente);


module.exports = api;   