'use strict'

const categoriaModel = require("../modelos/categoria.model");
const productoModel = require("../modelos/producto.model");

//Función para poder agregar una nueva categoria a la base de datos
function registrarCategoria (req, res)  {
    var cat = new categoriaModel();
    var params = req.body;
    if(req.user.rol === 'ROL_ADMIN'){    
    if (params.categoria) {
            cat.categoria = params.categoria;
            categoriaModel.find({
                $or: [{ categoria: cat.categoria }]
            }).exec((err, encontrarCategoria) => {
                if (err) return res.status(500).send({ mensaje: 'Error al agregar Categoria' });
                if (encontrarCategoria && encontrarCategoria.length == 1) {
                    return res.status(500).send({ mensaje: 'Esta Categoria ya Existe' });
                } else {
                    cat.save((err, categoriaGuardada) => {
                        if (categoriaGuardada) {
                             res.status(300).send(categoriaGuardada)
                        } else {
                             res.status(404).send({ mensaje: 'Esta Categoria no ha podido registrarse' })
                        }
                    })
                }  
            })
        }
    } else {
        res.status(404).send({ mensaje: 'No tienes permiso para registrar una categoria' })
    }
}

//Función para obtener un listado y visualizar las categorias en la base de datos
function obtenerCategorias (req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(404).send({ mensaje: 'No tienes permisos para obtener categorias'})
    categoriaModel.find((err, encontrarCategoria)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(!encontrarCategoria) return res.status(404).send({ mensaje: 'No se han encontrado categorias'});
        return res.status(200).send({encontrarCategoria});
    })
}

//Función para poder editar una categoria
function editarCategoria  (req, res){
    var categoriaID = req.params.categoriaID;
    var params = req.body;
    if (req.user.rol === 'ROL_ADMIN') {
        categoriaModel.findByIdAndUpdate(categoriaID, params, { new: true }, (err, actualizarCategoria) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion editar categoria' });
        if (!actualizarCategoria) return res.status(404).send({ mensaje: 'No se ha podido actualizar esta categoria' });
        return res.status(200).send({ actualizarCategoria });
    })
    } else {
        return res.status(404).send({ mensaje: 'No tienes permisos para editar Categoria'})
    }  
}

//Esta Función nos servirá para poder crear una categoria por default a la que se irán todos los productos
//pertenecientes a una categoria eliminada.
function categoriaDefault (req, res){
var categoriaID = 'Default';
    var cat = new categoriaModel();
    cat.categoria = categoriaID;
    categoriaModel.find({categoria: cat.categoria}).exec((err, categoriaEncontrada)=>{
        if(err) return res.status(404).send({ mensaje: 'Error en la petición' });
        if(categoriaEncontrada && categoriaEncontrada.length >= 1){
           console.log('La categoria Default ya existe' )
        }else{
            cat.save((err, categoriaGuardada)=>{
                if(err) console.log('No se ha podido guardar la categoria')
                if(categoriaGuardada){
                    console.log({ categoriaGuardada })
                }else{
                    console.log('No se ha podido agregar la categoría')
                }
            })
        }
    })
}

//Función para Eliminar una categoria de la base de datos
function eliminarCategoria (req, res){
    if(req.user.rol === 'ROL_ADMIN'){
    var categoriaID = req.params.categoriaID;
    categoriaDefault();
    categoriaModel.findOne({categoria: "Default"}, (err, categoriaDefault)=>{
        categoriaModel.findByIdAndDelete(categoriaID, (err, eliminarCategoria) => {
            if(err) return res.status(404).send({ mensaje: 'Error en la periticion eliminar Categoria'});
            productoModel.find({categoria: categoriaID}).exec((err, encontrarProducto)=>{
                encontrarProducto.forEach((nuevaCategoria)=>{
                    //Validacion para que lo productos pertencientes pasen a una categoria por default
                    productoModel.findByIdAndUpdate(nuevaCategoria._id,{categoria:categoriaDefault},(err,Actualizar)=>{
                        if(!eliminarCategoria) return res.status(404).send({ mensaje: 'No se ha podido eliminar la categoria'});   
                    })  
                }) 
            })   
            return res.status(200).send({ mensaje: 'Categoria Elminada' })
        })
    })
    } else {
        return res.status(404).send({mensaje:'No tienes permisos para eliminar Categorias'})
    }
}

module.exports = {
    registrarCategoria,
    obtenerCategorias,
    editarCategoria,
    eliminarCategoria,
    categoriaDefault
}