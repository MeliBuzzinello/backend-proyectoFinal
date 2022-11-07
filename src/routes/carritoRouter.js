import express from 'express';
// import { productosDao as productosApi } from '../daos/index.js';
import CarritosDaoMariaDb from '../daos/carritos/CarritosDaoMariaDb.js';
const { Router } = express;

const carritosApi = new CarritosDaoMariaDb();

const carritosRouter = new Router()

let idCar = 0;

carritosRouter.get('/', async (req, res) => {
        const products = await carritosApi.listarAll();
        res.send(products);
});

carritosRouter.post('/', async (req, res) => {
        const carrito = {};
        carrito.idCar = idCar++;
        carrito.timestamp = Date.now();
        carrito.productos = (req.body); 
        res.send(await carritosApi.guardar(carrito));
});

carritosRouter.delete('/:idCar', async (req, res) => {
        const { idCar } = req.params;
        res.send(await carritosApi.borrar(idCar));
});

//--------------------------------------------
// router de productos en carrito

carritosRouter.get('/:idCar/productos', async (req, res) => {
        const { idCar } = req.params;
        const products = await carritosApi.listarAll();
        const product = products.find(e => e.idCar == idCar);
        const newProducts = products.filter(e => e != product);
        res.send(newProducts.productos);
})

carritosRouter.post('/:idCar/productos', async (req, res) => {
        const { idCar } = req.params;
        const carrito = carritosApi.listar(idCar);
        carrito.productos = (req.body); 
        res.send(await carritosApi.guardar(carrito));
})

carritosRouter.delete('/:idCar/productos/:idProd', async (req, res) => {
        const { idCar } = req.params;
        const { idProd } = req.params;
        const carrito = await carritosApi.listar(idCar);
        const prodcar = carrito.find(e => e.idProd == idProd)
        const prodDelet = carrito.filter(e => e != prodcar)
        res.send(prodDelet);
})


export default carritosRouter;