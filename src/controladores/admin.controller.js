'use strict'

const usuarioModel = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");

function registrarUsuario(req, res)  {
    var user = new usuarioModel();
    var params = req.body;
  
    if(req.user.rol === 'ROL_ADMIN'){    
    if (params.usuario && params.password) {
            user.usuario = params.usuario;
            user.rol =  params.rol;
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
                            } else {
                                 res.status(404).send({ mensaje: 'Este usuario no ha podido registrarse' })
                            }
                        })
                    })
                }
            })
        }
    } else {
        res.status(404).send({ mensaje: 'No tienes permiso para registrar un cliente' })
    }
}

function editarRol  (req, res){
    var clienteID = req.params.clienteID;
    var params = req.body;
    delete params.usuario;
    delete params.password;
    if (req.user.rol === 'ROL_ADMIN') {
    if(params.rol === 'ROL_ADMIN' || params.rol === 'ROL_CLIENTE'){
        usuarioModel.findByIdAndUpdate(clienteID, params, { new: true }, (err, actualizarCliente) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar cliente' });
        if (!actualizarCliente) return res.status(404).send({ mensaje: 'No se ha podido actualizar este cliente' });
        return res.status(200).send({ actualizarCliente });
    })
    }else{
        return res.status(404).send({ mensaje: 'Este tipo de Rol no existe'})
    }
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar Cliente'})
    }
    
}

function editarCliente  (req, res){
    var clienteID = req.params.clienteID;
    var params = req.body;
    delete params.password;
    delete params.rol;  
    if (req.user.rol === 'ROL_ADMIN') {
        if (clienteID != 'ROL_CLIENTE'){
            return res.status(404).send({ mensaje: 'No puedes editar este tipo de Rol'})
        }
        usuarioModel.findByIdAndUpdate(clienteID, params, { new: true }, (err, actualizarCliente) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar cliente' });
        if (!actualizarCliente) return res.status(404).send({ mensaje: 'No se ha podido actualizar este cliente' });
        return res.status(200).send({ actualizarCliente });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar Cliente'})
    }
    
}

function eliminarCliente (req, res){
    var clienteID = req.params.clienteID;
    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(404).send({ mensaje: 'No tienes permisos para eliminar clientes'})
    }
    usuarioModel.findByIdAndDelete(clienteID, (err, eliminarCliente) => {
        if(err) return res.status(404).send({ mensaje: 'Error en la periticion eliminar Cliente'});
        if(!eliminarCliente) return res.status(404).send({ mensaje: 'No se ha podido eliminar el cliente'});
        return res.status(200).send({ mensaje: 'Cliente eliminado'})
    })

}



module.exports = {
    registrarUsuario,
    editarRol,
    eliminarCliente,
    editarCliente
}