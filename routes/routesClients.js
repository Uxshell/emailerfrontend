const express = require('express');
const ClientService = require('../services/clientService');
const protectRoutes = express.Router();
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const SEED_AUTENTICACION = config.seedAuth;
const EXPIRATION = config.expiration;

function routesClientApi(app) {
    const router = express.Router();
    app.use('/clients', router);

    const userService = new ClientService();

    router.post('/getClients', async function(req, res, next) {
        const { body: query } = req;

        //console.log(" init req.query: " + JSON.stringify(query));
        const queryClient = query.query;
        //console.log("  req.query: " + JSON.stringify(req.body.query));
        try {
            const clients = await userService.getClients(queryClient);

            res.status(200).json({
                success: true,
                total: clients.length,
                clients: clients,
                message: 'query clients'
            });
        } catch (err) {
            res.status(501).json({
                total: 0,
                success: false,
                message: 'error'
            });
            next(err);
        }
    });



    router.get('/getFilters', async function(req, res, next) {
        try {
            const clients = await userService.getFilters();

            res.status(200).json({
                success: true,
                total: clients.length,
                filters: clients[0],
                message: 'query clients'
            });
        } catch (err) {
            res.status(501).json({
                total: 0,
                success: false,
                message: 'error'
            });
            next(err);
        }
    });

    router.post('/setFilters', async function(req, res, next) {
        const { body: query } = req;

        //console.log(" init req.query: " + JSON.stringify(query));
        const filters = query.query;
        //console.log("  req.query: " + JSON.stringify(req.body.query));
        //console.log("req.query: " + JSON.stringify(filters));
        try {
            const clients = await userService.setFilters(filters);

            res.status(200).json({
                success: true,
                total: clients.length,
                clients: clients,
                message: 'query clients'
            });
        } catch (err) {
            res.status(501).json({
                total: 0,
                success: false,
                message: 'error'
            });
            next(err);
        }
    });





    //------clients//////
    router.post('/addClients', async function(req, res, next) {
        const { body: clients } = req;
        //console.log("client: " + JSON.stringify(req.body));

        try {
            //const users = await userService.addClients({ client });
            const users = await userService.addClients({ clients });
            res.status(201).json({
                success: true,
                message: 'user created'
            });
        } catch (err) {
            res.status(501).json({
                success: false,
                message: 'error'
            });
            next(err);
        }
    });


    router.post('/upsertClients', async function(req, res, next) {
        const { body: client } = req;
        //console.log("Client_ID" + client._id);

        try {
            const users = await userService.upsertClients({ client }, client._id);

            res.status(201).json({
                success: true,
                message: 'user created'
            });
        } catch (err) {
            res.status(501).json({
                success: false,
                message: 'error'
            });
            next(err);
        }
    });





    //validador de token en HEADER
    protectRoutes.use((req, res, next) => {
        const token = req.headers['access-token'];
        //console.log("token: " + token);
        if (token) {
            jwt.verify(token, SEED_AUTENTICACION, (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválida' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                mensaje: 'Token no proporcionado.'
            });
        }
    });

}


module.exports = routesClientApi;