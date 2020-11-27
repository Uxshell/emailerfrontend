import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import{RestService} from '../rest.service';
import { ListaService } from '../_services/listaService';
import{ClienteService} from '../_services/clienteService';
import {Campaign} from '../_models/campaignModel';
import { User } from 'src/app/_models/user';
import {Cliente} from '../_models/clienteModel';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  name: string;
  
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'BOUNCE', weight: 0, symbol: 'H'},
  { name: 'DELIVERY', weight: 110, symbol: 'He'},
  { name: 'SEND', weight: 110, symbol: 'Li'},
  { name: 'REJECT', weight: 0, symbol: 'Be'},
  { name: 'COMPLAINT', weight: 0, symbol: 'B'},
  { name: 'OPEN', weight: 59, symbol: 'C'},
  { name: 'CLICK', weight: 22, symbol: 'C'},
];

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})

export class CampaignComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Delivery', 'Reject', 'Bounces'];
  public pieChartData: SingleDataSet ;

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
 public miC: Campaign;
 public enviados;

  hidden = false;
  displayedColumns: string[] = ['name', 'weight'];
  dataSource = ELEMENT_DATA;
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  public campanias: Campaign[] =[];

  constructor(private listService: ListaService, private cs: ClienteService,public dialog: MatDialog, public res:RestService) { 
    this.cargandoC();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }
   
  ngOnInit(): void {
    //this.cargarLista();
    this.cargandoC();
   }

   cargandoC(){
    //this.cargando=true;
    this.res.getCampanias().subscribe((data)=>{
      this.campanias = data.campaigns;
      console.log(this.campanias);
      for(let i=0;i<this.campanias.length; i++){
        this.miC= this.campanias[i];
         this.enviados= this.miC.deliverys
        console.log('enviados'+this.enviados);
        this.pieChartData=[this.enviados,2,10];
      }
      //var milistas:Lista[]=[]= data.data;
      //var listas = data.data;
      //console.log("data list: " + JSON.stringify(this.listas));
          
    });

  /*this.listService.cargarListas().subscribe((listas)=>{

    
    //this.cargando= false;
    this.listas= listas;
    console.log(listas);
  });*/
}
  
  }

   


   


