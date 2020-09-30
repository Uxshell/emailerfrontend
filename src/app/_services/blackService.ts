import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Black } from '../_models/blackModel';
import {Cliente} from '../_models/clienteModel';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })


export class BlackService {
    endpoint = 'http://localhost:3000';
    
    constructor( private http: HttpClient
    ){}
    
    cargarBlacks() {

        const url = `${ this.endpoint }/blacks`;
        return this.http.get( url )
                  .pipe(
                    map( (resp:{ok:boolean, blacks:Black[]}) =>resp.blacks)
                  );            
      }
    
      crearBlack( data ):Observable<any> {

        const url = `${ this.endpoint }/blacks`;
        return this.http.post( url,  data  );
      }

      eliminarLista( _id: string ) {

        const url = `${ this.endpoint }api/blacks/${_id}`;
        return this.http.delete( url );
      }
     

}