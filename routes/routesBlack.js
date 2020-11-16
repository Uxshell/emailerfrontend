const express = require('express');
const  BlackService = require('../services/blackService');
const protectRoutes = express.Router();
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const SEED_AUTENTICACION = config.seedAuth;

function routesBlackApi(app) {
    const router = express.Router();
    app.use('/black', router);

    const BS = new BlackService();

    router.get('/getBlacks', async function(req, res, next) {
        const { tags } = req.query;

        try {
            const blacks = await BS.getBlacks({ tags });

            res.status(200).json({
                data: blacks,
                success: true,
                message: 'blacks listed'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list blacks'
            });
        }
    });


    router.get('/getBlack/:listaId', async function(req, res, next) {
        const { listaId } = req.params;

        try {
            const black = await BS.getBlack({ userId });

            res.status(200).json({
                data: black,
                success: true,
                message: 'get black list '
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list black'
            });
        }
    });

    //-----UPDATE LISTA----------
    router.post('/updateBlack/:blackId', protectRoutes, async function(req, res, next) {
        const { blackId } = req.params;
        const { body: black } = req;
        try {
            const blacks = await BS.updateList({ blackId, black });

            res.status(200).json({
                data: blacks,
                success: true,
                message: 'black update'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to update black'
            });
        }
    });

  
    router.post('/addBlack', protectRoutes, async function(req, res, next) {
        const { body: black } = req;
        try {
            const createdBlackId = await BS.createBlack({ black });

            res.status(201).json({
                blackId: createdBlackId,
                success: true,
                message: 'black created'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to create black'
            });
        }
    });

}


module.exports = routesBlackApi;