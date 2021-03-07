'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({

producto: String,
stock: Number,
precio: Number,
vendido: Number,

categoria: {type: Schema.Types.ObjectId, ref: 'categoria'}

});
module.exports = mongoose.model('producto',ProductoSchema);