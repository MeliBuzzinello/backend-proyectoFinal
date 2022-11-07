import ContenedorSQL from "../../contenedores/ContenedorSQL.js";
//import { crearTablasCarritos, crearTablasProdEnCarritos } from '../../../scripts/crearTablas.js';
//NOTA: aun sin llamar las funciones crearTablas, se inicializan solas. Reiniciando las tablas a 0

class CarritosDaoSQL {

    constructor(configCarritos, configProds) {
        this.carritos = new ContenedorSQL(configCarritos, 'carritos')
        this.prodsEnCarrito = new ContenedorSQL(configProds, 'prodsEnCarrito')
    }
 
    //convierto mi argumento en objeto
    async guardar(carrito = {}) {
        const result = await this.carritos.guardar(carrito)
        result.productos = []
        return result
    }

    // lista los productos que tiene el carrito segun id carrito
    async listar(_idCarrito) {
        const idCarrito = Number(_idCarrito)
        await this.carritos.listar(idCarrito)
        const result = {
            id: idCarrito,
            productos: []
        }
        const prodsEnCarrito = await this.prodsEnCarrito.listarAll({ idCarrito })
        for (const prod of prodsEnCarrito) {
            delete prod.idCarrito
            result.productos.push(prod)
        }
        return result  // retorna un objeto con id carrito y array de objetos
    }

    async actualizar(carrito) {
        carrito.id = Number(carrito.id)
        await this.prodsEnCarrito.borrarAll({ idCarrito: carrito.id })
        const inserts = carrito.productos.map(p => {
            return this.prodsEnCarrito.guardar({
                ...p,
                idCarrito: carrito.id
            })
        })
        return Promise.allSettled(inserts)
    }
    
    //borra todo el carrito segun su id
    async borrar(_idCarrito) {
        const idCarrito = Number(_idCarrito)
        const result = await Promise.allSettled([
            this.prodsEnCarrito.borrarAll({ idCarrito }),
            this.carritos.borrar(idCarrito)
        ])
        return result
    }
    
    //borra todos los carritos
    borrarAll() {
        return Promise.allSettled([
            this.carritos.borrarAll(),
            this.prodsEnCarrito.borrarAll()
        ])
    }
    
    //trae todos los carritos con sus productos
    async listarAll() {
        const carritosIds = await this.carritos.listarAll()
        
        //si listar all carritos esta vacia crea la tabla  en la base de datos
        // if(carritosIds === undefined ){ 
        //     crearTablasProdEnCarritos();
        //     crearTablasCarritos();
        // }

        const carritosMap = new Map()
        for (const obj of carritosIds) {
            carritosMap.set(obj.id, {
                id: obj.id,
                productos: []
            })
        }
        const prodsEnCarrito = await this.prodsEnCarrito.listarAll()
        for (const prod of prodsEnCarrito) {
            if (carritosMap.has(prod.idCarrito)) {
                carritosMap.get(prod.idCarrito).productos.push(prod)
            }
        }
        return [...carritosMap.values()]
    }
}

export default CarritosDaoSQL