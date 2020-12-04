import { Component, OnInit } from '@angular/core';

import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import{RestService} from '../rest.service';
import { ListaService } from '../_services/listaService';
import{ClienteService} from '../_services/clienteService';
import {Campaign} from '../_models/campaignModel';
import { User } from 'src/app/_models/user';
import {Cliente} from '../_models/clienteModel';
import {Company} from '../_models/companyModel';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-company',

  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  creationDate: any;
  public c: Company[] =[];
  typesOfShoes: string[] = ['BBVA Bancomer', 'Social Noise', 'MarketINC', 'Santander IDEAS', 'Sneakers'];
  constructor(public dialog: MatDialog, public res:RestService) { 
    
   }

  ngOnInit(): void {
    this.cargarLista();
  
   }
   cargarLista(){
    let query = {};
    
    
        
      
      this.res.getCompanys().subscribe((data)=>{
       // this.res.getLists(this.request).subscribe((data)=>{
        this.c = data.cs;
        //var milistas:Lista[]=[]= data.data;
        //var listas = data.data;
        console.log("data company: " + JSON.stringify(this.c));
            
      });
      

    /*this.listService.cargarListas().subscribe((listas)=>{

      
      //this.cargando= false;
      this.listas= listas;
      console.log(listas);
    });*/
  }

   async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nueva empresa',
      text: 'Ingrese el nombre de la nueva empresa, companía, etc',
      input: 'text',
      inputPlaceholder: 'NOMBRE',
      showCancelButton: true,
    });

    let datoUsuario = JSON.parse(localStorage.getItem('usuario'));
    this.creationDate = new Date();
    if( value.trim().length > 0 ) {
      this.res.crearCompany( value )

      //this.res.getClients(this.request).subscribe((data) => {
      .subscribe( (resp: any) => {
      //  this.listas.push( resp.lista._id )
        //console.log('_id de lista antes de'+resp.lista._id);
      //  this.IDLISTA_generado=resp.lista._id.toString();
        
      })

    }
  }

  
  }

   


   


