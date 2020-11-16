const { ObjectId } = require('mongodb');
const { config } = require('../config');
const MongoClient = require('mongodb').MongoClient;

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
//
//const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;
const MONGO_URI = `mongodb+srv://elihu:M4ss1v3$T@clusterforemailer.nm3v3.mongodb.net/emailerDB?retryWrites=true&w=majority`;
//`mongodb+srv://michelle:$Trini2818@cluster0.w7b8d.mongodb.net/emailerDB?retryWrites=true&w=majority`;
class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
        this.dbName = DB_NAME;
    }

    connect() {
        if (!MongoLib.connection) {
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if (err) {
                        console.error("MI ERROR: " + err);
                        reject(err);
                    }

                    console.log('Connected succesfully to mongo');
                    resolve(this.client.db(this.dbName));
                });
            });
        }

        return MongoLib.connection;
    }

    getAll(collection, query) {
        return this.connect().then(db => {
            return db
                .collection(collection)
                .find(query)
                .toArray();
        });
    }

    getOne(collection, query) {
        return this.connect().then(db => {
            return db
                .collection(collection)
                .findOne(query);
        });
    }

    get(collection, id) {
        return this.connect().then(db => {
            return db.collection(collection).findOne({ _id: ObjectId(id) });
        });
    }

    create(collection, data) {
        return this.connect()
            .then(db => {
                return db.collection(collection).insertOne(data);
            })
            .then(result => result.insertedId);
    }

    createBulk(collection, data) {
        return this.connect()
            .then(db => {
                return db.collection(collection).insertMany(data);
                //return db.collection(collection).insert(data);

            })
            .then(result => result.insertedId);
    }

    upsertBulk(collection, data) {
        return this.connect()
            .then(db => {
                return db.collection(collection).upsertBulk(data);
            })
            .then(result => result.insertedId);
    }


    update(collection, id, data) {
        return this.connect()
            .then(db => {
                return db
                    .collection(collection)
                    .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
            })
            .then(result => result.upsertedId || id);
    }

    upsert(collection, data, id) {

        return this.connect()
            .then(db => {
                return db
                    .collection(collection)
                    .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
            })
            .then(result => result.upsertedId || id);
    }





    delete(collection, id) {
        return this.connect()
            .then(db => {
                return db.collection(collection).deleteOne({ _id: ObjectId(id) });
            })
            .then(() => id);
    }
}

module.exports = MongoLib;