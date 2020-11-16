const { Schema, model } = require('mongoose');

const BlackSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    /*
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }*/
}, {  collection: 'black' });


BlackSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Black', BlackSchema );
