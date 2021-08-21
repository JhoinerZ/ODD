const mysql= require('mysql')

const connection= mysql.createConnection({

    host: process.env.DB_HOST,
    user: "root",
    database: process.env.DB_DATABASE

});

connection.connect((error)=>{

    if(error){

        console.log("Hubo un " + error)
        return
    }
    console.log("Conexion exitosa")
})

module.exports= connection;