'use strict'

const express = require("express");
const usuarioController = require("../controladores/usuario.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.post('/registrarUsuario', md_authenticated.ensureAuth,usuarioController.registrarUsuario);


module.exports = api;