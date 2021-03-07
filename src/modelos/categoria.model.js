'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({

categoria: String

});
module.exports = mongoose.model('categoria',CategoriaSchema);