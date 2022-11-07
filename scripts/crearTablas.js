import knex from 'knex'
import config from '../src/config.js'

// opciones SQL: mariaDb, sqlite3

crearTablasProductos(knex(config.mariaDb))

crearTablasCarritos(knex(config.mariaDb))

crearTablasProdEnCarritos(knex(config.mariaDb))

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
  
        console.log("tabla productos creada con éxito");
      } catch (error) {
        console.log(`error al crear tabla productos ${error}`);
      } 
    }
    


//------------------------------------------

async function crearTablasCarritos(sqlClient) {
    try {
        await sqlClient.schema.dropTableIfExists("carritos");
  
        await sqlClient.schema.createTable("carritos", (table) => {
            table.increments("idCar");
        });
  
        console.log("tabla carrito creada con éxito");
      } catch (error) {
        console.log(`error al crear tabla carrito ${error}`);
      } 
    }


//---------------------------------------------------

async function crearTablasProdEnCarritos(sqlClient) {
  try {
      await sqlClient.schema.dropTableIfExists("prodsencarrito");

      await sqlClient.schema.createTable("prodsencarrito", (table) => {
          table.increments("idCar");
          table.integer("id");
          table.string("title");
          table.float("price");
          table.string("thumbnail");
      });
      console.log("tabla prodsencarrito creada con éxito");
    } catch (error) {
      console.log(`error al crear tabla prodsencarrito ${error}`);
    } 
  }
    

export { crearTablasProductos, crearTablasCarritos, crearTablasProdEnCarritos };