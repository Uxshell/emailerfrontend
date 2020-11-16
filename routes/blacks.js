

const { Router } = require('express');

const {
    getBlacks,
    borrarBlack,
    crearBlack
} = require('../controllers/controlerBlack')


const router = Router();

router.get( '/getBlacks', getBlacks );
router.delete('/borrarBlack/:id', borrarBlack);
router.post( '/',   crearBlack );
module.exports= router;