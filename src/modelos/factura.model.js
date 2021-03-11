'use strict'
const mongoose = require;
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    usuario: {type: Schema.Types.ObjectId, ref:'usuario'},
    productoCarrito: [{
        producto: {type: Schema.Types.ObjectId, ref:'producto'},
        cantidad: Number,
        subTotal: Number
    }]
})

module.exports = mongoose.model('factura', CarritoSchema);