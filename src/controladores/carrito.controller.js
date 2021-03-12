'use strict'

const carritoModel = require('../modelos/carrito.model');
const productoModel = require('../modelos/producto.model');

//En esta función se pueden agregar diferentes productos al carrito de un usuario CLIENTE
function agregarProductoCarrito(req, res){
    var productoID = req.params.productoID;
    var usuarioID = req.user.sub;
    var params = req.body;
    if(req.user.rol != 'ROL_CLIENTE') return res.status(404).send({mensaje: 'No tienes permisos para agregar productos'});
    productoModel.findById(productoID).exec((err, encontrarProducto)=>{
        if(err) return res.status(404).send({mensaje:'Error en la peticion 1'})
        if(encontrarProducto.stock < params.cantidad) return res.status(404).send({mensaje: 'No hay suficientes productos, compre menos'})
        if(!encontrarProducto) return res.status(404).send({ mensaje:'Error en la peticion 2'})
        if(encontrarProducto.stock == 0) return res.status(404).send({mensaje: 'No hay productos disponibles, hasta el viernes me traen'})
        var intCantidad = parseInt(params.cantidad, 10);
        var precio = encontrarProducto.precio;
        var subTotalFinal = intCantidad * encontrarProducto.precio;
            carritoModel.findOne({usuarioCarrito:req.user.sub, "listaProducto.productoID":productoID},(err, buscarProductos)=>{
                if(err) return res.status(404).send({mensaje: 'Error en la peticion 3'})
                if(!buscarProductos){
                    carritoModel.findOneAndUpdate({usuarioCarrito:req.user.sub}, {$push:{
                        listaProducto:{nombre:encontrarProducto.producto,cantidad:intCantidad, 
                            precio:encontrarProducto.precio, subTotal:subTotalFinal, productoID:productoID}}},
                        {new:true, useFindAndModify:false}, (err, productoAgregado) =>{
                            if(err) return res.status(404).send({mensaje: 'Error en la peticion 4'})
                            if(!productoAgregado) return res.status(404).send({mensaje:'Error al ingresar datos'})
                            var productoID = req.params.productoID;
                            var total = parseInt(productoAgregado.total,10);
                            var intParam = parseInt(params.cantidad,10);
                            carritoModel.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProducto.productoID":productoID},
                            {total:total + (precio*intParam)},{new:true},(err,actualizar)=>{ 
                                return  res.status(200).send({Carrito:actualizar});})
                        })
                } else {
                    var productoList = buscarProductos.listaProducto;
                    var productosAlma = Object.assign({},productoList);
                    for (let valor=0; valor<productoList.length; valor++){
                        var listID = productoList[valor]._id;
                        var cantidadList = productoList[valor].cantidad;
                        var subTotalList = productoList[valor].subTotal;
                        var productoListID = productoList[valor].productoID;
                            if(req.params.productoID == productoListID){
                                //Validacion para no llevar mas productos de los que hay stock, sin restar del stock
                                var cantidadSuma = cantidadList+intCantidad
                                if(cantidadSuma > encontrarProducto.stock) return res.status(404).send({mensaje: 'No hay tantos productos en existencia'})
                                        carritoModel.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProducto.productoID":productoID},
                                        {"listaProducto.$.cantidad":intCantidad+cantidadList,"listaProducto.$.subTotal":subTotalList+subTotalFinal},
                                        (err,productoAgregado)=>{
                                            if(err) return res.status(404).send({mensaje:'Error en la peticion 5'})
                                            if(!productoAgregado) return res.status(404).send({mensaje: 'Error al ingresar productos'})
                                            var total = parseInt(productoAgregado.total,10);
                                            var intParam = parseInt(params.cantidad,10);
                                            carritoModel.findOneAndUpdate({usuarioCarrito:req.user.sub, "listaProducto.productoID":productoID},
                                            {total:total +(intParam*precio)},{new:true},(err,actualizar)=>{return res.status(200).send({Carrito:actualizar});})
                                        })      
                            }else{
                                console.log('Error')
                            }
                    }
                }
            })   
    }) 
}

module.exports = {
    agregarProductoCarrito
}

