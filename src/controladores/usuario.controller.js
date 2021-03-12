'use strict'
//Funciones para usuarios CLIENTE
const usuarioModel = require('../modelos/usuario.model');
const productoModel = require('../modelos/producto.model');
const categoriaModel = require('../modelos/categoria.model');
const carritoModel = require('../modelos/carrito.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');
const { Query } = require('mongoose');
const facturaModel = require('../modelos/factura.model');

//Función para iniciar sesión con un usuario y obtener su token
function loginUsuario (req, res)  {
    var params = req.body;
    usuarioModel.findOne({ usuario: params.usuario }, (err, encontrarUsuario) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición de Login' });
        if (encontrarUsuario) {
            bcrypt.compare(params.password, encontrarUsuario.password, (err, passwordCorrecta) => {
                if (passwordCorrecta) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(encontrarUsuario)
                        });
                    } else {
                        encontrarUsuario.password = undefined;
                        return res.status(200).send({ encontrarUsuario })
                    }
                    } else {
                        return res.status(404).send({ mensaje: 'El usuario no se ha encontrado' })
                  }
            })
        } else {
            return res.status(404).send({ mensaje: 'El usuario no ha podido ingresar' })
        }
    })
}

//Función para iniciar sesión con un usuario, ademas del token obtendrá todas las facturas a su nombre
function loginUsuarioFactura (req, res)  {
    var params = req.body;
    usuarioModel.findOne({ usuario: params.usuario }, (err, encontrarUsuario) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición de Login' });
        if (encontrarUsuario) {
            bcrypt.compare(params.password, encontrarUsuario.password, (err, passwordCorrecta) => {
                if (passwordCorrecta) {
                    if (params.getToken === 'true') {
                        if(encontrarUsuario.rol == 'ROL_ADMIN'){
                            return res.status(200).send({
                                token: jwt.createToken(encontrarUsuario)
                            });
                        } else if (encontrarUsuario.rol == 'ROL_CLIENTE'){
                            facturaModel.find({usuarioCarrito:encontrarUsuario}, (err, encontrarFactura) =>{
                                if (err) return res.status(200).send({ mensaje: 'Error en la peticion'});
                                if (encontrarFactura.length == 0){
                                    return res.status(200).send({ mensaje:`Detalle de ${encontrarUsuario.usuario}`, mensaje:"El usuario no tiene facturas" ,token: jwt.createToken(encontrarUsuario) });
                                } 
                                return res.status(200).send({mensaje: `Detalle de ${encontrarUsuario.usuario}`, encontrarFactura, token: jwt.createToken(encontrarUsuario)})
                            })
                        }
                    } else {
                        encontrarUsuario.password = undefined;
                        return res.status(200).send({ encontrarUsuario })
                    }
                    } else {
                        return res.status(404).send({ mensaje: 'El usuario no se ha encontrado' })
                  }
            })
        } else {
            return res.status(404).send({ mensaje: 'El usuario no ha podido ingresar' })
        }
    })
}

//Esta función nos permitirá crear un carrito que pertencerá a un cliente en especifico para poder realizar sus compras
function crearCarrito(usuarioID){
    var carrito = new carritoModel();
    carrito.listaProducto =[]
    carrito.usuarioCarrito = usuarioID;
    carrito.total = 0;
    carrito.save();
}
//Esta función nos permitirá crear un usuario y asignarle automaticamente el rol CLIENTE y establecer un carrito de compras
function registrarCliente(req, res)  {
    var user = new usuarioModel();
    var params = req.body;
    if(req.user.rol === 'ROL_CLIENTE'){    
    if (params.usuario && params.password) {
            user.usuario = params.usuario;
            user.rol =  'ROL_CLIENTE';
            usuarioModel.find({
                $or: [{ usuario: user.usuario }]
            }).exec((err, encontrarUsuario) => {
                if (err) return res.status(500).send({ mensaje: 'Error al agregar Usuario' });
                if (encontrarUsuario && encontrarUsuario.length == 1) {
                    return res.status(500).send({ mensaje: 'Este usuario ya Existe' });
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                        user.password = passwordEncriptada;
                        user.save((err, usuarioGuardado) => {
                            if (usuarioGuardado) {
                                 res.status(300).send(usuarioGuardado)
                                 crearCarrito(usuarioGuardado._id)
                            } else {
                                 res.status(404).send({ mensaje: 'Este usuario no ha podido registrarse' })
                            }
                        })
                    })
                }
            })
        }
    } else {
        res.status(404).send({ mensaje: 'No tienes permiso para registrar este rol' })
    }
}
//Función para editar el propio perfil de la persona con sesión iniciada
function editarPerfil (req, res){
    var clienteID = req.params.clienteID;
    var params = req.body;
    delete params.password;
    delete params.rol;  
    if (clienteID != req.user.sub) {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar perfil'})
    } 
    if (req.user.rol === 'ROL_CLIENTE') {
        usuarioModel.findByIdAndUpdate(clienteID, params, { new: true }, (err, actualizarPerfil) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar perfil' });
        if (!actualizarPerfil) return res.status(404).send({ mensaje: 'No se ha podido actualizar este Perfil' });
        return res.status(200).send({ actualizarPerfil });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar este Perfil'})
    }
}

//Función para eliminar la propia cuenta de la persona con sesión iniciada
function eliminarCuenta (req, res){
    var clienteID = req.params.clienteID;
    if (clienteID != req.user.sub) {
        return res.status(404).send({ mensaje: 'No tienes permisos para eliminar Cuenta'})
    } 
    if (req.user.rol === 'ROL_CLIENTE'){
    usuarioModel.findByIdAndDelete(clienteID, (err, eliminarCuenta) => {
        if(err) return res.status(404).send({ mensaje: 'Error en la periticion eliminar Cuenta'});
        if(!eliminarCuenta) return res.status(404).send({ mensaje: 'No se ha podido eliminar la Cuenta'});
        return res.status(200).send({ mensaje: 'Cuenta Eliminada'})
    })
    } else {
        return res.status(404).send({mensaje: 'no tienes permisos para eliminar cuenta'})
    }
}

//Función para poder obtener un PRODUCTO buscadolo por el Nombre
function obtenerProductoNombre (req, res){
    var proNombre = req.params.proNombre;
    if (req.user.rol != 'ROL_CLIENTE') return res.status(404).send({ mensaje: 'No tienes permisos para obtener Productos' })
    productoModel.findOne({producto: proNombre}, (err, encontrarProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!encontrarProducto) return res.status(404).send({ mensaje: 'Este producto no existe' });
        return res.status(200).send(encontrarProducto);
    })
}

//Función para obtener un listado y visualizar todas las categorias existentes
function obtenerCategoriasExistentes (req, res){
    if (req.user.rol != 'ROL_CLIENTE') return res.status(404).send({ mensaje: 'No tienes permisos para obtener categorias'});
    categoriaModel.find((err, encontrarCategoria)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(!encontrarCategoria) return res.status(404).send({ mensaje: 'No se han encontrado categorias'});
        return res.status(200).send({encontrarCategoria});
    })
}

//Función para obtener un CÁTALOGO que nos permita ver las categorias existentes
function obtenerCatalogoCategoria (req, res){
    var categoriaID = req.params.categoriaID;
    if (req.user.rol != 'ROL_CLIENTE') return res.status(404).send({ mensaje: 'No tienes permisos para obtener categorias'});
    productoModel.find({categoria: categoriaID}, (err, encontrarProducto) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!encontrarProducto) return res.status(404).send({ mensaje: 'Este producto no existe' });
        return res.status(200).send(encontrarProducto);
    })
}

//Función para obtener un CÁTALOGO que nos permita ver los productos más vendidos
function obtenerCatalogoMasVendidos(req, res){
    if(req.user.rol != 'ROL_CLIENTE') return res.status(404).send({mensaje:'No tienes permisos para ver productos mas vendidos'})
        productoModel.find((err, encontrarProducto)=>{
            if(err) return res.status(404).send({ mensaje:'Error en la peticion'})
            if(!encontrarProducto) return res.status(404).send({mensaje: 'Error en la peticion'})
            return res.status(200).send({productos: encontrarProducto});
        }).sort({vendido: -1}).limit(10)
}

//Función para poder visualizar la FACTURA DETALLADA del usuario con sesión iniciada
function facturaDetallada(req, res){
    var facturaID = req.params.facturaID
    if(req.user.rol != 'ROL_CLIENTE') return res.status(404).send({mensaje:'No tienes permisos para ver esta factura detallada'})
    facturaModel.findById(facturaID).exec((err, encontrarFactura)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'})
        if(!encontrarFactura) return res.status(404).send({mensaje:'Error en la peticion'})
        if(encontrarFactura.usuarioCarrito != req.user.sub) return res.status(404).send({ mensaje:'No tienes permisos para ver esta factura detallada'})
        return res.status(200).send({'Facturas del Usuario':encontrarFactura})
    })
}

module.exports = {
    loginUsuario,
    registrarCliente,
    editarPerfil,
    eliminarCuenta,
    obtenerProductoNombre,
    obtenerCategoriasExistentes,
    obtenerCatalogoCategoria,
    loginUsuarioFactura,
    obtenerCatalogoMasVendidos,
    facturaDetallada
}