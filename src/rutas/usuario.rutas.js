'use strict'

const express = require("express");
const usuarioController = require("../controladores/usuario.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();

api.post('/loginUsuario', usuarioController.loginUsuario);
api.post('/registrarCliente', md_authenticated.ensureAuth,usuarioController.registrarCliente);
api.put('/editarPerfil/:clienteID', md_authenticated.ensureAuth,usuarioController.editarPerfil);
api.delete('/eliminarCuenta/:clienteID', md_authenticated.ensureAuth,usuarioController.eliminarCuenta);
api.get('/obtenerProductoNombre/:proNombre', md_authenticated.ensureAuth, usuarioController.obtenerProductoNombre);
api.get('/obtenerCategoriasExistentes', md_authenticated.ensureAuth , usuarioController.obtenerCategoriasExistentes);
api.get('/obtenerCatalogoCategoria/:categoriaID', md_authenticated.ensureAuth, usuarioController.obtenerCatalogoCategoria);

module.exports = api;