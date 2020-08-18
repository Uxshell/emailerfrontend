import { Component, OnInit } from '@angular/core';


import { ListaService } from '../_services/listaService';
import{ClienteService} from '../_services/clienteService';
import {Lista} from '../_models/listaModel';
import {Cliente} from '../_models/clienteModel';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
public listas: Lista[] =[];
public clientes: Cliente[]= [];
public cargando: boolean = true;

  constructor(private listService: ListaService, private cs: ClienteService,public dialog: MatDialog) { 

  }
  
  name: string;
  position: number;
  weight: number;
  symbol: string;

  
  ngOnInit(): void {
   this.cargarLista();
    
  }

  cargarLista(){
    this.cargando=true;
    this.listService.cargarListas().subscribe(listas=>{
      
      this.cargando= false;
      this.listas= listas;
      console.log(listas);
    });
  }
  ClientsbyLista(lista:Lista){
    this.cs.getClientsbyLista(lista._id).subscribe(clientes=>{
     this.clientes =clientes;
      console.log(this.clientes); 
    });

  }
  
  borrarLista(lista: Lista){
    Swal.fire({
      title: '¿Borrar lista?',
      text: `Se eliminará el registro de la lista pero está acción no afectará el registro de Clientes en la Base de datos`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.listService.eliminarLista( lista._id )
          .subscribe( resp => {
            
            //this.cargarUsuarios();
            Swal.fire(
              'Lista borrada',
              `${ lista.nombre } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })
  }


  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nueva lista',
      text: 'Ingrese el nombre de la nueva lista',
      input: 'text',
      inputPlaceholder: 'Nombre de la lista',
      showCancelButton: true,
    });
    
    if( value.trim().length > 0 ) {
      this.listService.crearLista( value )
        .subscribe( (resp: any) => {
          this.listas.push( resp.lista )
        })
    }
  }

}


