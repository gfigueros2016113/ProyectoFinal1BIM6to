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


function obtenerCategorias (req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(404).send({ mensaje: 'No tienes permisos para obtener categorias'})
    categoriaModel.find((err, encontrarCategoria)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(!encontrarCategoria) return res.status(404).send({ mensaje: 'No se han encontrado categorias'});
        return res.status(200).send({encontrarCategoria});
    })
}

function editarCategoria  (req, res){
    var categoriaID = req.params.categoriaID;
    var params = req.body;
    if (req.user.rol === 'ROL_ADMIN') {
        categoriaModel.findByIdAndUpdate(categoriaID, params, { new: true }, (err, actualizarCategoria) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar categoria' });
        if (!actualizarCategoria) return res.status(404).send({ mensaje: 'No se ha podido actualizar esta categoria' });
        return res.status(200).send({ actualizarCategoria });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar Categoria'})
    }
    
}



function eliminarCategoria (req, res){
    var categoriaID = req.params.categoID;
    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({ mensaje: 'No tienes permisos para eliminar categorias'})
    }
    categoriaModel.findByIdAndDelete(categoriaID, (err, eliminarCategoria) => {
        if(err) return res.status(404).send({ mensaje: 'Error en la periticion eliminar Categoria'});
        if(!eliminarCategoria) return res.status(404).send({ mensaje: 'No se ha podido eliminar la categoria'});
        return res.status(200).send({ mensaje: 'Categoria Eliminada'})
    })

}

module.exports = {
    registrarCategoria,
    obtenerCategorias,
    editarCategoria,
    eliminarCategoria
}