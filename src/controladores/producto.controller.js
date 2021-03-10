'use strict'

const productoModel = require('../modelos/producto.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');

function registrarProducto (req, res){
    var params = req.body;
    var categoriaID = req.params.categoriaID;
    var prod = productoModel();
    
    if(req.user.rol != 'ROL_ADMIN') return res.status(404).send({mensaje: 'No tienes permisos para registrar productos'});
    if(!params.producto || !params.precio) return res.status(404).send({mensaje: 'No ha rellenado todos los campos'});
    prod.producto = params.producto;
    prod.stock = params.stock;
    prod.precio = params.precio;
    prod.vendido = 0;
    prod.categoria = categoriaID;
    productoModel.find({
        $or: [{producto: prod.producto}]
        }).exec((err, encontrarProducto)=> {
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(encontrarProducto && encontrarProducto.length == 1) return res.status(404).send({mensaje:'Este producto esta en existencia'});
        prod.save((err, encontrarProducto) => {
            if(err) return res.status(404).send({mensaje: 'No se ha podido guardar el producto'});
            if(!encontrarProducto) return res.status(404).send({ mensaje: 'Error al registrar producto'})
            return res.status(200).send({encontrarProducto})
        })
    })
}

function obtenerListaProducto (req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(404).send({ mensaje: 'No tienes permisos para obtener Productos'})
    productoModel.find((err, encontrarProducto)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(!encontrarProducto) return res.status(404).send({ mensaje: 'No se han encontrado Productos'});
        return res.status(200).send({encontrarProducto});
    })
}

function obtenerProducto (req, res){
    var proID = req.params.proID;
    if (req.user.rol != 'ROL_ADMIN') return res.status(404).send({ mensaje: 'No tienes permisos para obtener el Producto' })
    productoModel.findById(proID, (err, encontrarProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!encontrarProducto) return res.status(404).send({ mensaje: 'Este producto no existe' });
        return res.status(200).send({ encontrarProducto });
    })
}

function editarProducto (req, res){
    var proID = req.params.proID;
    var params = req.body;
    delete params.vendido;
    if (req.user.rol === 'ROL_ADMIN') {
        productoModel.findByIdAndUpdate(proID, params, { new: true }, (err, actualizarProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar producto' });
        if (!actualizarProducto) return res.status(404).send({ mensaje: 'No se ha podido actualizar este producto' });
        return res.status(200).send({ actualizarProducto });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar producto'})
    }    
}

function editarStock (req, res){
    var proID = req.params.proID;
    var params = req.body;
    delete params.producto;
    delete params.precio;
    delete params.vendido;
    delete params.categoria;
    if (req.user.rol === 'ROL_ADMIN') {
        productoModel.findByIdAndUpdate(proID, params, { new: true }, (err, actualizarProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar Stock' });
        if (!actualizarProducto) return res.status(404).send({ mensaje: 'No se ha podido actualizar este Stock' });
        return res.status(200).send({ actualizarProducto });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar Stock'})
    }
}

function eliminarProducto (req, res){
    var proID = req.params.proID;
    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({ mensaje: 'No tienes permisos para eliminar Productos'})
    }
    productoModel.findByIdAndDelete(proID, (err, eliminarProducto) => {
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion eliminar Producto'});
        if(!eliminarProducto) return res.status(404).send({ mensaje: 'No se ha podido eliminar el Producto'});
        return res.status(200).send({ mensaje: 'Producto eliminado'})
    })
}

module.exports = {
    registrarProducto,
    obtenerListaProducto,
    obtenerProducto,
    editarProducto,
    editarStock,
    eliminarProducto
}
