const MongoLib = require('../lib/mongo');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

class UserService {
    constructor() {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }



    async getUsers({ tags }) {
        const query = tags && { tags: { $in: tags } };

        const users = await this.mongoDB.getAll(this.collection, query);
        return users;
    }

    async getUser({ userId }) {
        const user = await this.mongoDB.get(this.collection, userId);
        return user;
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

    async createAdminUser() {
        var user = {
            username: "admin",
            email: "admin",
            rol: 'admin'
        }
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("admin");
        user.password = hash;
        const newUser = await this.mongoDB.create(this.collection, user);
        return newUser;
    }



    async createUser({ user }) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        const newUser = await this.mongoDB.create(this.collection, user);
        return newUser;
    }

    async updateUser({ userId, user } = {}) {
        if (user.password) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;

        }
        const updateUser = await this.mongoDB.update(this.collection, userId, user);
        return updateUser;
    }

    async changePassword({ user } = {}) {

        if (user.password) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
            var userId = user.userId;
            const updateUser = await this.mongoDB.update(this.collection, userId, user);
            return updateUser;
        } else {
            return {
                error: "password no proporcionado"
            }
        }
    }

    //-----------LOGIN---------------
    async login({ user } = {}) {
    

        var res = {};
        var query = { email: user.email };
        var userDB = await this.mongoDB.getOne(this.collection, query);
        if (userDB === null) {
            console.log("//user don't found");
            return res = {
                success: false,
                err: {
                    message: "user don't found"
                }
            };
        } else {
            if (!bcrypt.compareSync(user.password, userDB.password)) {
                return res = {
                    success: false,
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                };
            }else{


            const SEED_AUTENTICACION = config.seedAuth;
            const EXPIRATION = config.expiration;


            let token = jwt.sign({
                usuario: userDB,
            }, SEED_AUTENTICACION, {
                expiresIn: EXPIRATION
            })
            var userResponse = {
                userId: userDB._id,
                name: userDB.name,
                email: user.email,
                rol: userDB.rol
            }
            return {
                success: true,
                user: userResponse,
                token,
            }
        }
    }
    }



}


module.exports = UserService;