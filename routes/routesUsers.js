const express = require('express');
const UserService = require('../services/userService');
const protectRoutes = express.Router();
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const SEED_AUTENTICACION = config.seedAuth;

function routesUserApi(app) {
    const router = express.Router();
    app.use('/users', router);

    const userService = new UserService();

    router.get('/getUsers', async function(req, res, next) {
        const { tags } = req.query;

        try {
            const users = await userService.getUsers({ tags });

            res.status(200).json({
                data: users,
                success: true,
                message: 'users listed'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list users'
            });
        }
    });


    router.get('/getUser/:userId', async function(req, res, next) {
        const { userId } = req.params;

        try {
            const user = await userService.getUser({ userId });

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

    //-----UPDATE USER----------
    router.post('/updateUser/:userId', protectRoutes, async function(req, res, next) {
        const { userId } = req.params;
        const { body: user } = req;
        try {
            const users = await userService.updateUser({ userId, user });

            res.status(200).json({
                data: users,
                success: true,
                message: 'user update'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to update users'
            });
        }
    });

    //-----UPDATE USER----------
    router.post('/changePassword', async function(req, res, next) {
        console.info("post in server");
        const { body: user } = req;

        try {
            const users = await userService.changePassword({ user });

            res.status(200).json({
                data: users,
                success: true,
                message: 'password changed'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to change password'
            });
        }
    });

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


    router.post('/getUserByEmail', protectRoutes, async function(req, res, next) {
        const { body: user } = req;
        try {
            const userDB = await userService.getUserByEmail({ user });

            res.status(201).json({
                response: userDB
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to create user'
            });
        }
    });


    router.post('/login', async function(req, res, next) {
        const { body: user } = req;
        try {
            const success = await userService.login({ user });
               
            res.status(200).json({
                response: success,
                message: 'login success'
            });
        } catch (err) {
            next(err);
            res.status(500).json({
                success: false,
                message: 'error to list users'
            });
        }
    });


    router.post('/login/google', async function(req, res, next) {

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


module.exports = routesUserApi;