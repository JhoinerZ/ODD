const app= require("./src/config/server");
const connection= require("./src/config/bd");
require('./src/app/routes/navegacion')(app);

app.listen(app.get('port'), () =>{

    console.log("El servidor esta en el puerto: ", app.get('port'));
})