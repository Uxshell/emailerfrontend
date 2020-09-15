import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Lista } from '../_models/listaModel';
import {Cliente} from '../_models/clienteModel';
@Injectable({ providedIn: 'root' })
export class ClienteService {
    endpoint = 'ec2-52-205-245-151.compute-1.amazonaws.com:3000/api';
    
    constructor( private http: HttpClient
    ){}
    
  getClientsbyLista( _id: string ) {

    const url = `${ this.endpoint }/clientes/${_id}`;
    return this.http.get( url )
              .pipe(
                map( (resp:{ok:boolean, clients:Cliente[]}) =>resp.clients)
                
              );   
              

}}