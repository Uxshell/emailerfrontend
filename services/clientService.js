const MongoLib = require('../lib/mongo');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
var ObjectId = require('mongodb').ObjectID;

class ClientService {
    constructor() {
        this.collection = 'clients';
        this.mongoDB = new MongoLib();
    }

    async getClients(query) {
        //console.log("query: " + JSON.stringify(query));
        //var queryClients = query.body.query;
        const clients = await this.mongoDB.getAll(this.collection, query);
        return clients;
    }
    async getFilters(query) {
        //var query = {};
        console.log("query: " + JSON.stringify(query))
        const filters = await this.mongoDB.getAll("filters", query);
        return filters;
    }
    async setFilters(filters) {
        var query = {
            id: "filters"
        };
        var filtersDB = await this.getFilters(query);
        //console.log("filtersDB: " + JSON.stringify(filtersDB));

        if (Array.isArray(filtersDB) && filtersDB.length) {
            console.log("update because is not empty");
            var id = filtersDB[0]._id;
            var dataDB = filtersDB[0].filters;
            var data = filters.filters;

            delete filtersDB._id;
            const allFilters = data.concat(dataDB);

            let unique = [...new Set(allFilters)];

            var object = {
                id: "filters",
                filters: unique
            }

            const filters_ = await this.mongoDB.upsert("filters", object, id);
            return filters_;

        } else {
            console.log("insert because is empty");

            const filters_ = await this.mongoDB.create("filters", filters);
            return filters_;

        }


    }

    async getUser({ userId }) {
        const user = await this.mongoDB.get(this.collection, userId);
        return user;
    }

    async createClient({ client }) {
        const newClient = await this.mongoDB.create(this.collection, client);
        return newClient;
    }

    async addClients({ clients }) {
        //console.log("clients --> : " + JSON.stringify(clients));
        const newClient = await this.mongoDB.createBulk(this.collection, clients);
        return newClient;
    }

   async upsertClients({ client }, id) {
        delete client["_id"];
        const newClient = await this.mongoDB.upsert(this.collection, client, id);
        return newClient;
    }



}


module.exports = ClientService;