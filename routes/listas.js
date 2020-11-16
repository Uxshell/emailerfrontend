
const { Router } = require('express');

const {
    getListas,
    borrarLista,
    crearLista
} = require('../controllers/controlerLista')


const router = Router();
router.get( '/getListas', getListas );
router.delete('/borrarLista/:id', borrarLista);
router.post( '/',   crearLista );
module.exports= router;