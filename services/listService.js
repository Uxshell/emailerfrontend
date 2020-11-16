const MongoLib = require('../lib/mongo');
const Lista = require('../models/listaModel');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

class ListaService {
    constructor() {
        this.collection = 'lists';
        this.mongoDB = new MongoLib();
    }
    



    async getLists({ tags }) {
        const query = tags && { tags: { $in: tags } };

        const listas = await this.mongoDB.getAll(this.collection, query);
        return listas;
    }

    async getList({ listaId }) {
        const lista = await this.mongoDB.get(this.collection, listaId);
        return lista;
    }

    async getUserById({ user }) {
        var query = { email: user.email };
        var userDB = await this.mongoDB.getOne(this.collection, query);
        if (userDB === null) {
            console.log("//user don't found");
            return {
                success: false,
                err: {
                    message: "No Existe el usuario"
                }
            }
        } else {
            var userResponse = {
                userId: userDB._id,
                name: userDB.name,
                email: user.email,
                rol: userDB.rol
            }

            return {
                success: true,
                user: userResponse,
            }

        }
    }

    async getUserByEmail({ user }) {
        var query = { email: user.email };
        var userDB = await this.mongoDB.getOne(this.collection, query);
        if (userDB === null) {
            console.log("//user don't found");
            return {
                success: false,
                err: {
                    message: "No Existe el usuario"
                }
            }
        } else {
            var userResponse = {
                userId: userDB._id,
                name: userDB.name,
                email: user.email,
                rol: userDB.rol
            }

            return {
                success: true,
                user: userResponse,
            }

        }
    }
     async borrarLista({id}) {

        //const id  = req.params.id;
    
        try {
            
            const lista = await Lista.findById( id );
            
            if ( !lista ) {
                return res.status(404).json({
                    ok: true,
                    msg: 'Lista no encontrado por id',
                });
            }
    
            await Lista.findByIdAndDelete( id);
    
    
            return {
                ok: true,
                msg: 'Lista eliminada'
            }
    
        } catch (error) {
    
            console.log(error);
    
           return{
                ok: false,
                msg: 'Hable con el administrador'
            }
        }
    }
    


    

    



}


module.exports = ListaService;