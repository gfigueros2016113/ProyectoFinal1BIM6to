'use strict'


const express = require("express");
const categoriaController = require("../controladores/categoria.controller");
const md_authenticated = require("../middlewares/authenticated");
var api = express.Router();


api.post('/registrarCategoria', md_authenticated.ensureAuth , categoriaController.registrarCategoria);
api.get('/obtenerCategorias/:usuarioID', md_authenticated.ensureAuth , categoriaController.obtenerCategorias);
api.put('/editarCategoria/:categoriaID', md_authenticated.ensureAuth , categoriaController.editarCategoria);


module.exports = api;   