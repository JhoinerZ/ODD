const app= require("../../config/server");
const dbconnection= require("../../config/bd_rd");
const bcryptjs = require("bcryptjs")

module.exports= app=>{

    app.get('/c_logueado', (req, res)=>{
        if(req.session.loggedin){
            res.render('../views/index_ul.ejs',{
                login: true,
                usuario: req.session.usuario
            })
            
        }else{
            res.render('../views/index_ul.ejs',{
                login: false,
                usuario: "Inicia sesion"
            })
        }
    })

    app.get("/servicios", (req, res)=>{

        connection.query("SELECT * FROM config_s", (err, result)=>{

            res.render('../views/servicios_d.ejs', {

                services: result
            })
        })
    })

    app.get("/a_logueado", (req, res)=>{

        if(req.session.loggedin){

            res.render('../views/index_al.ejs',{
                login: true,
                usuario: req.session.usuario
            })

        } else{

            res.render('../views/index_al.ejs',{
                login: false,
                usuario: "Inicia sesion"
            })
        }


    })

    app.get('/cartera', (req, res)=>{

        connection.query('SELECT * FROM deudores', (err, results)=>{

            res.render('../views/cartera.ejs', {

                deudores: results
            })
        })
    })
  
    app.get('/', (req, res)=>{

        res.render('../views/index_u.ejs')
    })

    app.get('/login', (req, res)=>{

        res.render('../views/login.ejs');
    })

    app.get('/register', (req, res)=>{

        res.render('../views/register.ejs');
    })


    app.get('/config', (req, res)=>{

        connection.query('SELECT * FROM productos', (err, results)=>{
            const productos = results; 

            connection.query('SELECT * FROM config_s', (err, results)=>{
                const config = results
                
                res.render("../views/config.ejs", {

                    productos: productos,
                    config: config
                    
                });
            })
        })
    
    })




    app.get('/control_a', (req, res)=>{

        connection.query('SELECT * FROM citas', (err, result)=>{
            const citas = result

            connection.query('SELECT * FROM control_agenda', (err, result) =>{
            
                res.render('../views/control_a.ejs', {
    
                    control_agenda: result,
                    citas: citas
                })
            })
        })

        
    })

    app.get('/citas', (req, res)=>{

        connection.query('SELECT * FROM control_agenda', (err, result) =>{
                const control_agenda = result

                    connection.query('SELECT * FROM citas ', (err, result)=>{

                        const citas = result

                        res.render('../views/cita.ejs', {

                            control_agenda: control_agenda,
                            citas: citas

                        })
                    })

                        
          })
                    
    })
 
    app.get('/index_a', (req, res)=>{
        if(req.session.loggedin){
            res.render('../views/index_a.ejs',{
                login: true,
                usuario: req.session.usuario
            })
            
        }else{
            res.render('../views/index_a.ejs',{
                login: false,
                usuario: "Inicia sesion"
            })
        }
    })

    app.post('/register', async (req, res)=>{
        const {nombre, usuario, correo1, contraseña, rol}= req.body;
        console.log(req.body);
        let passwordHaash= await bcryptjs.hash(contraseña, 8);
        connection.query(
            
            "INSERT INTO registro SET ?", 
            {
            nombre: nombre,
            usuario: usuario,
            correo: correo1,
            contraseña: passwordHaash,
            rol: "cliente"
            },

            async(error, results)=>{

                if(error){

                    console.log(error)
                } else{

                    res.render('../views/register.ejs', {

                        alert: true,
                        alertTitle: "Registro Exitoso", 
                        alertMessage: "Gracias por registrarte",
                        alertIcon: "success",
                        showConfirmButton: true,
                        timer: 15000,
                        ruta: ''
                    })
                }
            }

        )
    })

    app.post('/auth',async (req, res)=>{

        const {usuario, contraseña}= req.body;
        let passwordHaash= await bcryptjs.hash(contraseña, 8);

        if(usuario && contraseña){

            connection.query('SELECT * FROM registro WHERE usuario = ?', [usuario], async(err, results)=>{

                console.log(results);
                    if(results.length == 0 || !(await bcryptjs.compare(contraseña, results[0].contraseña))){
                        res.render('../views/login.ejs', {

                            alert: true,
                            alertTitle: "Algo esta mal :(", 
                            alertMessage: "Revisa que tu usuario y tu contraseña esten correctos",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: 15000,
                            ruta: 'login'
                        });

                    }else if(results[0].rol === "cliente"){
                        req.session.loggedin= true
                        req.session.usuario = results[0].usuario;
                        res.render('../views/login.ejs', {

                            alert: true,
                            alertTitle: "Hola de nuevo ", 
                            alertMessage: ":)",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 15000,
                            ruta: 'c_logueado'
                        });
                    }

                    else if(results[0].rol === "admin"){

                        req.session.loggedin= true
                        req.session.usuario = results[0].usuario;
                        res.render('../views/login.ejs', {

                            alert: true,
                            alertTitle: "Hola de nuevo ", 
                            alertMessage: ":)",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 15000,
                            ruta: 'a_logueado'
                        });


                    }
            })
        }
    })

    app.get('/logout', (req, res)=>{

        req.session.destroy(()=>{
            res.redirect('/')
        })
    })

    const connection= dbconnection();
    app.get("/r_ventas", (req, res)=>{
        connection.query('SELECT * FROM registro_VE' , (err, result) =>{
            const registro = result

            connection.query('SELECT * FROM registro_VD', (err, result) =>{
                const detalle = result
            
                res.render('../views/registrod.ejs', {

                    registro: registro,
                    detalle: detalle
                })
            
            })
            

    })

    app.post('/hola', (req, res) =>{

                const {Total_v, rol, id_u, date, numero_r} = req.body;

                connection.query('INSERT INTO registro_VE set?',
            {
                idregistroventa: numero_r,
                total_venta: Total_v,
                forma_pago: rol,
                id_usuariocliente: id_u,
                fecha_compra: date

            }, (err, result)=>{

                res.redirect('/r_ventas')
            });
        });
        
    }); 
    
    app.get('/delete/:id_elem', (req, res) => {
        let id_elem = req.params.id_elem;
        connection.query("DELETE FROM registro_VE WHERE idregistroventa = ?", [id_elem], (err,results)=>{
            if (err){
                res.send(err);
            } else {
                console.log(results.affectedRows + " entradas actualizadas");
                res.redirect("/r_ventas");
            }
        })
    })
    

    app.post('/edit/:idregistroventa', async(req, res)=>{

        const idregistroventa= req.params.idregistroventa;
        const{total, forma, id}= req.body;
        
       /*  res.send("Nombre completo: " + fullname + " Usuario " + user + " Contraseña " + pass) */
       connection.query("UPDATE registro_VE SET total_venta = ?, forma_pago = ?, id_usuariocliente = ? WHERE idregistroventa = ?", [total, forma, id, idregistroventa], (err, results)=>{

            if(err){

                res.send(err)
            } else{

                res.redirect("/r_ventas")
            }
       })

    })
        

    app.post('/deuda', (req, res)=>{

        const {saldo, ref, tel_ref, id_usuario, id_registrodia, id_detalle} = req.body;

        connection.query('INSERT INTO deudores set?',
            {

                id_detalle: id_detalle,
                id_registrodia: id_registrodia,
                id_usuario: id_usuario,
                saldo: saldo,
                referencia: ref,
                t_referencia: tel_ref

            }, (err, result)=>{

                res.redirect('/cartera')
            });        
    })


    app.post('/control', (req, res)=>{

        const {month, date, year} = req.body;

        connection.query('INSERT INTO control_agenda set?',
            {
                dia: date,
                mes: month,
                año: year,

            }, (err, result)=>{

                res.redirect('/control_a')
            });        
    })

    app.get('/eliminar/:id_dia', (req, res) => {
        let id_dia = req.params.id_dia;
        connection.query("DELETE FROM control_agenda WHERE id_dia = ?", [id_dia], (err, results)=>{
            if (err){
                res.send(err);
            } else {
                console.log(results.affectedRows + " entradas eliminadas");
                res.redirect("/control_a");
            }
        })
    })


    app.post('/producto', (req, res)=>{

        const {nombre, valor} = req.body;

        connection.query('INSERT INTO productos set?',
            {
                nombre: nombre,
                valor: valor

            }, (err, result)=>{

                res.redirect('/config')
            });        
    })


    app.post('/servicio', (req, res)=>{

        const {servicio, tiempo, valor, descripcion} = req.body;

        connection.query('INSERT INTO config_s set?',
            {
                servicios: servicio,
                tiempo_servicio: tiempo,
                valor: valor,
                descripcion: descripcion

            }, (err, result)=>{

                res.redirect('/config')
            });        
    })


    app.post('/editando/:id_producto', async(req, res)=>{

        const id_producto= req.params.id_producto;
        const{nombre, valor}= req.body;
        
       /*  res.send("Nombre completo: " + fullname + " Usuario " + user + " Contraseña " + pass) */
       connection.query("UPDATE productos SET nombre = ?, valor = ? WHERE id_producto = ?", [nombre, valor, id_producto], (err, results)=>{

            if(err){

                res.send(err)
            } else{

                res.redirect("/config")
            }
       })

    })

    app.post('/detail', (req, res)=>{

        const{id_p, cant, valor, fecha, id_r}= req.body;

        connection.query("INSERT INTO registro_VD set ?", 
        {

         
            id_producto: id_p,
            cantidad: cant,
            valor: valor,
            fecha: fecha,
            numero_registro: id_r

        }, (err, result)=>{

            res.redirect("/r_ventas")
            
        })
    })


    app.get('/elimi/:id_producto', (req, res)=>{

        const id_producto = req.params.id_producto;

        connection.query("DELETE FROM productos WHERE id_producto = ?", [id_producto], (err, results)=>{
            if (err){
                res.send(err);
            } else {
                console.log(results.affectedRows + " entradas eliminadas");
                res.redirect("/config");
            }
        })
    })


    app.get('/borrar/:id_producto', (req, res) => {
        let id_producto = req.params.id_producto;
        connection.query("DELETE FROM registro_VD WHERE id_producto = ? ", [id_producto], (err,results)=>{
            if (err){
                res.send(err);
            } else {
                console.log(results.affectedRows + " entradas actualizadas");
                res.redirect("/r_ventas");
            }
        })
    })


    app.post('/modificar/:id_producto', async(req, res)=>{

        const id_producto= req.params.id_producto;
        const{prod, cant, valor}= req.body;
        
       /*  res.send("Nombre completo: " + fullname + " Usuario " + user + " Contraseña " + pass) */
       connection.query("UPDATE registro_VD SET id_producto = ?, cantidad = ?, valor = ? WHERE id_producto = ?", [prod, cant, valor, id_producto], (err, results)=>{

            if(err){

                res.send(err)
            } else{

                res.redirect("/r_ventas")
            }
       })

    })

    app.post('/agendar', (req, res)=>{

        const{name, fecha, servicio, telefono}= req.body

        connection.query("INSERT INTO citas SET ?",{
 
            nombre_cliente: name,
            fecha_cita: fecha,
            servicio: servicio,
            telefono: telefono

        }, (err, result)=>{

            res.redirect("/citas")
        })
    })


    app.get('/D/:id_cita', (req, res) => {
        let id_cita = req.params.id_cita;
        connection.query("DELETE FROM citas WHERE id_cita = ? ", [id_cita], (err,results)=>{
            if (err){
                res.send(err);
            } else {
                console.log(results.affectedRows + " entradas actualizadas");
                res.redirect("/control_a");
            }
        })
    })

}

