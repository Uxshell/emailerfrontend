const MongoLib = require('../lib/mongo');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

class BlackService {
    constructor() {
        this.collection = 'black';
        this.mongoDB = new MongoLib();
    }
    



    async getBlacks({ tags }) {
        const query = tags && { tags: { $in: tags } };
        const blacks = await this.mongoDB.getAll(this.collection, query);
        return blacks;
    }

    async getBlack({ blackId }) {
        const black = await this.mongoDB.get(this.collection, blackId);
        return black;
    }


    
    async createBlack({ black }) {
        //var salt = bcrypt.genSaltSync(10);
        //var hash = bcrypt.hashSync(user.password, salt);
        //user.password = hash;
        const newList = await this.mongoDB.create(this.collection, black);
        return newList;
    }

    async updateList({ blackId, black } = {}) {
        
        const updateList = await this.mongoDB.update(this.collection, blackId, black);
        return updateList;
    }

    



}


module.exports = BlackService;