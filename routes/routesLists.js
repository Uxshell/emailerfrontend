const express = require('express');
const  ListaService = require('../services/listService');
const protectRoutes = express.Router();
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const SEED_AUTENTICACION = config.seedAuth;

function routesListApi(app) {
    const router = express.Router();
    app.use('/lists', router);

    const listService = new ListaService();

    router.get('/getListas', async function(req, res, next) {
        const { tags } = req.query;

        try {
            const listas = await listService.getLists({ tags });

            res.status(200).json({
                data: listas,
                success: true,
                message: 'lists listed'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list listas'
            });
        }
    });


    router.get('/getLista/:listaId', async function(req, res, next) {
        const { listaId } = req.params;

        try {
            const lista = await listService.getList({ userId });

            res.status(200).json({
                data: user,
                success: true,
                message: 'get user '
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list users'
            });
        }
    });

    //-----UPDATE LISTA----------
    router.post('/updateLista/:listaId', protectRoutes, async function(req, res, next) {
        const { listaId } = req.params;
        const { body: lista } = req;
        try {
            const listas = await listService.updateList({ listaId, lista });

            res.status(200).json({
                data: listas,
                success: true,
                message: 'lista update'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to update lista'
            });
        }
    });

    router.delete('/:id',async function(req, res, next) {
        const { id } = req.params;
        try {
     const delet = await listService.borrarLista({id});
     res.status(200).json({
        //users: delet,
        data: delet,
        success: true,
        message: 'lista eliminada'
    });
    } catch (err) {
        next(err);
        res.status(500).json({
            success: false,
            message: 'error '
        });
        }
      }
    );


    router.get('/getUsers', async function(req, res, next) {
        try {
            const users = await userService.getUsers();

            res.status(201).json({
                users: users,
                success: true,
                message: 'users list'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to create user'
            });
        }
    });

    router.post('/createAdminUser', async function(req, res, next) {
        try {
            const createdUserId = await userService.createAdminUser();

            res.status(201).json({
                userId: createdUserId,
                success: true,
                message: 'user created'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to create user'
            });
        }
    });
    router.post('/addUser', protectRoutes, async function(req, res, next) {
        const { body: user } = req;
        try {
            const createdUserId = await userService.createUser({ user });

            res.status(201).json({
                userId: createdUserId,
                success: true,
                message: 'user created'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to create user'
            });
        }
    });


    


   

}


module.exports = routesListApi;