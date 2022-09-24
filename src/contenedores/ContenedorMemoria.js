class ContenedorMemoria {

    constructor() {
        this.productos = []
    }

    listar(id) {
        const products =  this.listarAll();
        const productById = products.find(p => p.id == id);
            if(!productById){
                return `{'error': 'producto no encontrado'}`;
            }
            return productById;
    }

    listarAll() {
        try {
            if(this.productos.length === 0){
               return `{'error': 'producto no encontrado'}`;
            }
            return this.productos;
        } catch (error) {
            console.error(error);
        }
    }

    guardar(elem) {
        const products = this.listarAll();
        const productsObj = JSON.parse(products); 
        const idMay = Math.max(...productsObj.map(x=>parseInt(x.id)))
        const prodId = {id:idMay + 1, ...elem};
        this.productos.push(prodId);
        return this.productos;
    }

    actualizar(prod, id) {
        this.productos[parseInt(id) -1 ] = {id:id, ...prod};
        return this.productos;
    }

    borrar(id) {
        const products = this.listarAll()
        if(products === ''){
            console.log('No hay productos')
        }
        const product = products.find(e => e.id == id)
        const newProducts = products.filter(e => e != product)
        this.productos = newProducts;
        try {
             return this.productos;
        } catch (error) {
            console.error(error)
        }
    }

    borrarAll() {
        this.productos = []
    }
}

export default ContenedorMemoria;
