import express from 'express';
const { Router } = express;
// import handlebars from 'express-handlebars';
import { engine } from 'express-handlebars';

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import ContenedorArchivo  from './contenedores/ContenedorArchivo.js';

//--------------------------------------------
// instancio servidor y persistencia

const app = express()

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set("views", "./public");

// app.engine(
//     'hbs',
//     handlebars({
//         extname: 'hbs',
//         defaultLayout: 'plantillas',
//         layoutsDir: __dirname + '/public',
//     })
// );

// app.set('view engine', 'hbs');
// app.set('views', './public');


// const productosApi = new ContenedorArchivo('./dbProductos.json')
// const carritosApi = new ContenedorArchivo('dbCarritos.json')

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
    const products = await productosApi.listarAll();
    res.render('productos', products);
});

productosRouter.post('/', soloAdmins, async (req, res) => {
    const products = await productosApi.guardar(req.body);
    res.render('productos', products);
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

const idCar = 0;

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

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname +'/public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app