'use strict'
// gfigueros2016113
const mongoose = require("mongoose")
const app = require('./app');
const usuarioModel = require("./src/modelos/usuario.model");
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ProyectoFinalDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    var usuario = 'ADMIN';
    var password = '123456';
    var rol = 'ROL_ADMIN';
    var user = new usuarioModel();

    user.usuario = usuario;
    user.rol = rol;

    usuarioModel.find({ usuario: user.usuario }).exec((err, encontrarUsuario) => {
       //Validar que ya existe el usuario inicial
        if (encontrarUsuario && encontrarUsuario.length == 1) {
            return console.log('Este usuario ya esta en existencia');
        } else {
            bcrypt.hash(password, null, null, (err, passwordEncriptada) => {
                user.password = passwordEncriptada;
                //Al iniciar el proyecto se crea un usuario ADMIN 
                user.save((err, encontrarUsuario) => {
                    if (err) return res.status(500).send({ mensaje: 'El usuario no ha podido guardarse' })
                    if (encontrarUsuario) {
                        return console.log(encontrarUsuario);
                    } else {
                        return res.status(500).send({ mensaje: 'No se ha podido registrar el Usuario' })
                    }
                })
            })
        }
    })
    app.listen(3000, function () {
        console.log('El servidor esta arrancando en el puerto: 3000')
    })
}).catch(er => console.log(er))
