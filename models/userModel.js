const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        required: true
    },
    google:{
        type: Boolean,
        default: false
    }
    /*
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }*/
}, {  collection: 'users' });


UserSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Usuario', UserSchema );
