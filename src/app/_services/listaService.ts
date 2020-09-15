import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Lista } from '../_models/listaModel';
import {Cliente} from '../_models/clienteModel';
@Injectable({ providedIn: 'root' })


export class ListaService {
    endpoint = 'ec2-52-205-245-151.compute-1.amazonaws.com:3000';
    
    constructor( private http: HttpClient
    ){}
    
    cargarListas() {

      
        const url = `${ this.endpoint }/lists/getListas`;
        return this.http.get( url )
                  .pipe(
                    map( (resp:{ok:boolean, listas:Lista[]}) =>resp.listas)
                  );            
      }
    
      crearLista( nombre: string ) {

        const url = `${ this.endpoint }/listas`;
        return this.http.post( url, { nombre } );
      }

      eliminarLista( _id: string ) {

        const url = `${ this.endpoint }/api/listas/borrarLista/${_id}`;
        return this.http.delete( url );
      }
     

}