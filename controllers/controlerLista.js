const {response}=  require('express');
const Lista = require('../models/listaModel');


const getListas = async(req, res = response)=>{
    //filtroUser = req.IDUSER;
    //const listas = await Lista.find({IDUSER: filtroUser});
    const listas = await Lista.find({IDUSER:'5f24405774598005a0e87b0e'});
    res.json({
        ok:true,
        listas
    })
}
const borrarLista = async(req, res=response)=>{
    const id= req.params.id;
    try{
        const lista = await Lista.findById(id);
        if(!lista){
            return res.status(404).json({
                ok:true,
                msg: 'Lista no encontrada por id',
            });
        }
        await Lista.findByIdAndDelete(id);
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
const crearLista = async(req, res = response) => {

    //const uid = req.uid;
    const lista = new Lista(req.body);

    try {
        
        const listaDB = await lista.save();
        

        res.json({
            ok: true,
            lista: listaDB,
            msg: listaDB._id
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    


}

module.exports={
    getListas,
    borrarLista,
    crearLista
}