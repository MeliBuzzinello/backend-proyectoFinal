import { promises as fs } from 'fs';
import config from '../config.js';

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        const products = await this.listarAll();
        const productById = products.find(p => p.id == id);
        return productById;
    }

    async listarAll() {
        try {
            const products = await fs.readFile(this.ruta , 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            return [];
        }
    }

    async guardar(obj) {
        try {
            const products = await fs.readFile(this.ruta , 'utf-8');
            const productsObj = JSON.parse(products); 
            const idMay = Math.max(...productsObj.map(x=>parseInt(x.id)))
            const prodId = {id:idMay + 1, ...obj};
            productsObj.push(prodId);
            await fs.writeFile(this.ruta , JSON.stringify(productsObj, null, 2));
        } catch (error) {
            console.log(error)
        }
    }

    async actualizar(elem, id) {
        const products = await this.listarAll();
        products[parseInt(id) -1 ] = {...elem, id:id};
        await fs.writeFile(this.ruta , JSON.stringify(products, null, 2));
    }

    async borrar(id) {
        const products = await this.listarAll()
        if(products === ''){
            console.log('No hay productos')
        }
        const product = products.find(e => e.id == id)
        const newProducts = products.filter(e => e != product)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(newProducts, null, 2))
        } catch (error) {
            console.log('error delete')
            console.error(error)
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.route, "")
        } catch (error) {
            console.error(error)
        }
    }
}

export default ContenedorArchivo;