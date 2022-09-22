import knex from 'knex'
import config from '../src/config.js'

// opciones SQL: mariaDb, sqlite3

crearTablasProductos(knex(config.sqlite3))
crearTablasCarritos(knex(config.sqlite3))

//------------------------------------------

async function crearTablasProductos(sqlClient) {
    try {
        await sqlClient.schema.dropTableIfExists("productos");
  
        await sqlClient.schema.createTable("productos", (table) => {
            table.increments("id");
            table.string("title");
            table.float("price");
            table.string("thumbnail");
        });
  
        console.log("tabla productos en sqlite3 creada con éxito");
      } catch (error) {
        console.log("error al crear tabla productos en sqlite3");
      } 
    }
    


//------------------------------------------

async function crearTablasCarritos(sqlClient) {
    try {
        await sqlClient.schema.dropTableIfExists("carrito");
  
        await sqlClient.schema.createTable("carrito", (table) => {
            table.increments("id");
            table.string("title");
            table.float("price");
            table.string("thumbnail");
        });
  
        console.log("tabla carrit0 en sqlite3 creada con éxito");
      } catch (error) {
        console.log("error al crear tabla carrito en sqlite3");
      } 
    }
    
