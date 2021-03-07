'use strict'

const categoriaModel = require("../modelos/categoria.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');

function registrarCategoria (req, res)  {
    var cat = new categoriaModel();
    var params = req.body;
  
    if(req.user.rol === 'ROL_ADMIN'){    
    if (params.categoria) {
            cat.categoria = params.categoria;
            categoriaModel.find({
                $or: [{ categoria: cat.categoria }]
            }).exec((err, encontrarCategoria) => {
                if (err) return res.status(500).send({ mensaje: 'Error al agregar Categoria' });
                if (encontrarCategoria && encontrarCategoria.length == 1) {
                    return res.status(500).send({ mensaje: 'Esta Categoria ya Existe' });
                } else {
                    cat.save((err, categoriaGuardada) => {
                        if (categoriaGuardada) {
                             res.status(300).send(categoriaGuardada)
                        } else {
                             res.status(404).send({ mensaje: 'Esta Categoria no ha podido registrarse' })
                        }
                    })
                }  
            })
        }
    } else {
        res.status(404).send({ mensaje: 'No tienes permiso para registrar una categoria' })
    }
}


module.exports = {
    registrarCategoria
}