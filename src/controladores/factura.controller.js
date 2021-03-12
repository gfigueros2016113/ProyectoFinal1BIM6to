'use strict'

const carritoModel = require("../modelos/carrito.model");
const facturaModel = require("../modelos/factura.model");
const productoModel = require("../modelos/producto.model");

//En esta función se extraen los datos del carrito de compras de un usuario para poder presentarlo en una factura
// y así descontar la compra del stock de los productos.
function obtenerFactura (req, res){
    var fact = facturaModel();
    if(req.user.rol != 'ROL_CLIENTE') return res.status(404).send({  mensaje: 'Tu rol no posee carrito para generar factura'})
    carritoModel.findOne({usuarioCarrito:req.user.sub},(err,encontrarCarrito)=>{
        if(err) return res.status(404).send({mensaje: 'Error en la peticion'})
        if(!encontrarCarrito) return res.status(404).send({mensaje: 'No se ha encontrado el carrito'})
        fact.total = encontrarCarrito.total;
        fact.listaProducto = encontrarCarrito.listaProducto;
        fact.usuarioCarrito = encontrarCarrito.usuarioCarrito;
        fact.save((err, encontrarFactura)=>{
            if(err) return res.status(404).send({mensaje: 'Error en la peticion'})
            var productoList = encontrarCarrito.listaProducto
            productoList.forEach(function(element) {
                productoModel.findById(element.productoID,(err, encontrarProducto) =>{
                    if(err) return res.status(404).send({mensaje: 'Error en la peticion'})
                    if(!encontrarProducto) return res.status(404).send({ mensaje:'Error al encontrar productos'})
                    productoModel.findByIdAndUpdate(element.productoID, {stock: encontrarProducto.stock - element.cantidad, vendido:encontrarProducto.vendido+element.cantidad}, (err, actualizar)=>{})
                })
            });
            carritoModel.findOneAndUpdate({usuarioCarrito: req.user.sub}, {$set:{listaProducto:[]},total:0},(err,vaciarCarrito)=>{
            })
            if(encontrarFactura){
                return res.status(404).send({encontrarFactura})
            }
        })  
    }) 
}

//Función para obtener un listado y visualizar los productos agotados
function productosAgotados(req, res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(404).send({ mensaje:'No tienes permisos para ver productos agotados'})
        productoModel.find({stock: 0}, (err, productoAgotado)=>{
            if(err) return res.status(404).send ({mensaje:'Error en la peticion'})
            if(!productoAgotado) return res.status(404).send({ mensaje: 'No hay productos agotados'})
            return res.status(200).send({productos: productoAgotado});
        })
}


//Función para obtener un top 7 de los productos más vendidos
function obtenerProductosMasVendidos(req, res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(404).send({mensaje:'No tienes permisos para ver productos mas vendidos'})
        productoModel.find((err, encontrarProducto)=>{
            if(err) return res.status(404).send({ mensaje:'Error en la peticion'})
            if(!encontrarProducto) return res.status(404).send({mensaje: 'Error en la peticion'})
            return res.status(200).send({productos: encontrarProducto});
        }).sort({vendido: -1}).limit(7)
}

//Función para obtener las facturas de todos los usuarios
function obtenerFacturasUsuario(req, res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(404).send({mensaje:'No tienes permisos para ver las facturas'})
        facturaModel.find((err, encontrarFactura)=>{
            if(err) return res.status(404).send({ mensaje:'Error en la peticion'})
            if(!encontrarFactura) return res.status(404).send({mensaje: 'Error en la peticion'})
            return res.status(200).send({Facturas: encontrarFactura});
        })
}

//Función para obtener los productos en una Factura especifica
function obtenerProductosFactura(req, res){
   var facturaID = req.params.facturaID
    if(req.user.rol != 'ROL_ADMIN') return res.status(404).send({mesaje:'No tienes permisos para ver esta factura'})
    facturaModel.find({_id:facturaID},{"listaProducto.productoID":1, "listaProducto.nombre":1},(err, encontrarFactura)=>{
        if(err) return res.status(404).send({ mensaje:'Error en la peticion'})
        if(!encontrarFactura) return res.status(404).send({mensaje: 'Error en la peticion'})
        return res.status(200).send({ProductosEnFactura: encontrarFactura});
    })
} 

module.exports = {
    obtenerFactura,
    productosAgotados,
    obtenerProductosMasVendidos,
    obtenerFacturasUsuario,
    obtenerProductosFactura
}