import express from 'express';
// import { productosDao as productosApi } from '../daos/index.js';
import ProductosDaoMariaDb from '../daos/productos/ProductosDaoMariaDb.js';
const { Router } = express;

const productosApi = new ProductosDaoMariaDb();

const productosRouter = new Router()

const esAdmin = true

function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin())
    } else {
        next()
    }
}

// Array de prueba
const productosArr = [
    {
        title: 'Calculadora',
        price: 1200,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-158.png'
    },
    {
        title: 'Cuaderno',
        price: 3200,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/book-note-paper-school-158.png'
    },
    {
        title: 'Lapiz',
        price: 400,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-158.png'
    }]

// Se renderizan los productos del array productos
productosRouter.get('/', async (req, res) => {
    const products = await productosApi.listarAll();
    res.send(products)
    // res.render('productos', { productos: products });
});

productosRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const products = await productosApi.listar(id);
    // res.render('productos', { productos: products });
    res.send(products)
});

productosRouter.post('/', soloAdmins, async (req, res) => {
    const products = await productosApi.guardar(req.body);
    // res.json(products)
    //res.render('productos', { productos: products });
    res.send(products)
});

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    const { id } = req.params;
    const products = await productosApi.actualizar(req.body, id);
    //res.render('productos', { productos: products });
    res.send(products)
});

productosRouter.delete('/:pos', soloAdmins, async (req, res) => {
    const { pos } = req.params;
    const products = await productosApi.borrar(pos);
    // res.render('productos', { productos: products });
    res.send(products)
});

export default productosRouter