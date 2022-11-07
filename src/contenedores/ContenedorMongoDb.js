import mongoose from 'mongoose';
import config from '../config.js';

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async listar(userid) {
        const listarId = await this.coleccion.find({_id: ObjectId(userid)});
        return listarId;
    }

    async listarAll() {
        const listarAll = await this.coleccion.find();
        return listarAll;
    }

    async guardar(nuevoElem) {
        await this.coleccion.insertOne(nuevoElem);
    }

    async actualizar(nuevoElem, userid) {
        
        await this.coleccion.save({_id: ObjectId(userid)},{nuevoElem});
    }

    async borrar(userid) {
        await this.coleccion.deleteOne({_id: ObjectId(userid)});
    }

    async borrarAll() {
        await this.coleccion.deleteMany();
    }
}

export default ContenedorMongoDb;