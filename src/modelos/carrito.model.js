'use strict'
const mongoose = require;
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    usuario: {type: Schema.Types.ObjectId, ref:'usuario'},
    productoCarrito: [{
        producto: {type: Schema.Types.ObjectId, ref:'producto'},
        cantidad: Number,
        subTotal: Number
    }]
})

module.exports = mongoose.model('carritos', CarritoSchema);