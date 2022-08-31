const express = require('express')
const { Router } = express

const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor y persistencia

const app = express()

const productosApi = new ContenedorArchivo('./dbProductos.json')
const carritosApi = new ContenedorArchivo('dbCarritos.json')

//--------------------------------------------
// permisos de administrador

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

//--------------------------------------------
// configuro router de productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const products = productosApi.listarAll();
    res.send(await products);
});

productosRouter.post('/', soloAdmins, async (req, res) => {
    res.send(await productosApi.guardar(req.body));
});

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    const { id } = req.params;
    res.send(await productosApi.actualizar(req.body, id));
});

productosRouter.delete('/:pos', soloAdmins, async (req, res) => {
    const { pos } = req.params;
    res.send(await productosApi.borrar(pos));
});

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router()

let id = 1;

carritosRouter.post('/', async (req, res) => {
    try {
        const carrito = {};
        carrito.id = id++;
        carrito.timestamp = Date.now();
        carrito.productos = (req.body); 
        res.json(await carritosApi.guardar(carrito));
        return(carrito.id);
     } catch (error) {
       console.log(error);  
     }
});

carritosRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json(carritosApi.borrar(id));
    } catch (error) {
        console.log(error);
    }
});

carritosRouter.get('/:id/productos', async (req, res) => {
    try {
        const { id } = req.params;
        const products = carritosApi.listarAll();
        const product = products.find(e => e.id == id);
        const newProducts = products.filter(e => e != product);
        res.json(newProducts.productos);
    } catch (error) {
        console.log(error);
    }
});

carritosRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    try {
        const { id } = req.params;
        res.json(carritosApi.borrar(id));
    } catch (error) {
        console.log(error);
    }
});

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

module.exports = app