'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    listaProducto: [{
        nombre: String,
        cantidad: Number,
        precio: Number,
        subTotal: Number,
        productoID: {type: Schema.Types.ObjectId, ref:'producto'}
    }],
    usuarioCarrito: {type: Schema.Types.ObjectId, ref:'usuario'},
    total: Number
})

module.exports = mongoose.model('factura', FacturaSchema);