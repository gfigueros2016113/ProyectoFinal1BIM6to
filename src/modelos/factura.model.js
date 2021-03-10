'use strict'
const mongoose = require;
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    listaProducto: [{
        producto: {type: Schema.Types.ObjectId, ref:'producto'},
        cantidad: Number,
        subTotal: Number
    }],
    usuario: {type: Schema.Types.ObjectId, ref:'usuario'},
    total: Number
})

module.exports = mongoose.model('factura', CarritoSchema);