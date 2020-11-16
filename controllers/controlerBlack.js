const {response}=  require('express');
const Black = require('../models/blackModel');


const getBlacks = async(req, res = response)=>{
    const listas = await Black.find();
    res.json({
        ok:true,
        listas
    })
}
const crearBlack = async(req, res = response) => {

    //const uid = req.uid;
    const lista = new Black({ 
      //  usuario: uid,
        ...req.body 
    });

    try {
        
        const listaDB = await lista.save();
        

        res.json({
            ok: true,
            lista: listaDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    


}
const borrarBlack = async(req, res=response)=>{
    const id= req.params.id;
    try{
        const lista = await Black.findById(id);
        if(!lista){
            return res.status(404).json({
                ok:true,
                msg: 'Lista no encontrada por id',
            });
        }
        await Black.findByIdAndDelete(id);
        res.json({
            ok:true,
            msg: 'Lista eliminada'
        });
    }catch (error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el admin'
        })
    }
}
module.exports={
    getBlacks,
    borrarBlack,
    crearBlack
}