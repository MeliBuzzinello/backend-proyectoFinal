import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('dbCarritos.json')
    }

    async guardar(carrito = { productos: [] }) {
        return await super.guardar(carrito)
    }
}

export default CarritosDaoArchivo
