import express from 'express';
import carritosRouter from './routes/carritoRouter.js';
import productosRouter from './routes/productosRoutes.js';

// import {
//     productosDao as productosApi,
//     carritosDao as carritosApi
// } from './daos/index.js';

//--------------------------------------------
// instancio servidor y persistencia

const app = express()

//--------------------------------------------
// midleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

//--------------------------------------------
// configuro el servidor

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

export default app
