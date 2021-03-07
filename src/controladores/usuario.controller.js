'use strict'
const usuarioModel = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');

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
                            } else {
                                 res.status(404).send({ mensaje: 'Este usuario no ha podido registrarse' })
                            }
                        })
                    })
                }
            })
        }
    } else {
        res.status(404).send({ mensaje: 'No tienes permiso para registrar un rol' })
    }
}

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

module.exports = {
    loginUsuario,
    registrarCliente,
    registrarUsuario
}