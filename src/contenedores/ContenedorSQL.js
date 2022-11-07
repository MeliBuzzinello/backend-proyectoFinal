import knex from 'knex';

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config)
        this.tabla = tabla
    }

    async listar(id) {
        const resultado = await this.knex(this.tabla).where('id', id);
        return resultado;
    }

    async listarAll() {
        const resultado = await this.knex(this.tabla).select('*');
        return resultado;
    }

    async guardar(elem) {
        await this.knex(this.tabla).insert(elem);
    }

    async actualizar(elem, id) {
        await this.knex(this.tabla).where('id', id).update( elem );
    }

    async borrar(id) {
        await this.knex(this.tabla).where('id', id).del();
    }

    async borrarAll() {
        await this.knex(this.tabla).del();
    }
}

export default ContenedorSQL;