const { Schema, model } = require('mongoose');

const ListaSchema = Schema({
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
}, {  collection: 'lists' });


ListaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Lista', ListaSchema );
