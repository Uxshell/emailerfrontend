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
  public pieChartLabels: Label[] = ['Delivery', 'Opens'];
  public pieChartData: SingleDataSet ;

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
 public miC: Campaign;
 public eD:Int32Array;
 public eO:Int32Array;
 public opens:Int32Array;
 public enviados;
 public ID_USER:string='';
public MYCOMPANY:string='';
public IDCFilter;
public eDNew:Int32Array;
public req={};
request={};
  hidden = false;
  displayedColumns: string[] = ['name', 'weight'];
  dataSource = ELEMENT_DATA;
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
 l:Campaign;
  public campanias: Campaign[] =[];
  public campaignsFilter: Campaign[] =[];
  public campaignsFilter2: Campaign[] =[];
  public mycompany;
  public result;
  constructor(private listService: ListaService, private cs: ClienteService,public dialog: MatDialog, public res:RestService) { 
//    this.cargandoC();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }
   
  ngOnInit(): void {
    //this.cargarLista();
    this.cargandoC();
  
   }
   async updateCampaigPRO(request) {
    let it = this;
  
    return new Promise(async function (resolve, reject) {
        it.res.updateCampaign(request).subscribe((data) => {
          resolve(data);
        
        });
      

    });
}
async  ultimateOpens(IDC) {
  var c=  '5fd17e62cc47293248e0a1bf';
  let t='this';
  console.log('valor de IDC en ultimate'+IDC);
   this.result= await this.res.getEmailsOpens(IDC).subscribe((data)=>{       
    //     console.log('valor de data'+data.eR);
         this.eO = data.eO;
         console.log(data.eO);
      
         this.req = { 
          IDC:this.IDCFilter,
          countDeliverys:this.eDNew,
          countRejects:2,
          countOpens: this.eO,
          countClicks:2,
    
    
        };
        this.actualizando(this.req);
       });
  
       
    

};

async  ultimateDeliverys(IDC) {
  var c=  '5fd17e62cc47293248e0a1bf';
  let t='this';
  console.log('valor de IDC en ultimate Deliverys'+IDC);
  await this.res.getEmailsDeliverys(IDC).subscribe((data)=>{       
         this.eD = data.eO;
         //console.log(data.eD);
         

       });

};

async cargandoC(){
     
    this.ID_USER = localStorage.getItem('userId');
    this.MYCOMPANY = localStorage.getItem('company');
  
  this.mycompany = this.MYCOMPANY.replace(/['"]+/g, '');
    var userId= this.ID_USER.replace(/['"]+/g, '');

 /*   this.request = {
      company: this.mycompany,
      userId: userId
    }*/

    
    this.res.getCampanias().subscribe((data)=>{
      this.campanias = data.campaigns;
      console.log(this.campanias);
      
      //this.campaignsFilter= this.campanias.filter(l => l.companyId === this.mycompany);
     // console.log('campañas filtradas'+this.campaignsFilter);
    //   console.log("NUm campañas filtradas"+this.campaignsFilter.length);
      for(let i=0;i<this.campanias.length; i++){

        this.miC= this.campanias[i];
        this.IDCFilter= this.campanias[i]._id;
        //var IDC= this.IDCFilter.replace(/['"]+/g, '');
        var IDC= JSON.stringify( this.IDCFilter);
        console.log('ID DE LA CAMPAIG'+this.IDCFilter);

        this.ultimateOpens(this.IDCFilter);
      /*  this.res.getEmailsSends(this.IDCFilter).subscribe((data)=>{       
          //console.log('valor de data'+data.eS);
          let eS= data.eS;
        });*/

      /*  
        this.res.getEmailsDeliverys(this.IDCFilter).subscribe((data)=>{       
          
          this.eDNew= data.eD;
      console.log('valor de data eDNew'+this.eDNew);

        });*/

       /* this.res.getEmailsRejects(this.IDCFilter).subscribe((data)=>{       
     //     console.log('valor de data'+data.eR);
          let eR= data.eR;
        });*/
        
        /*this.res.getEmailsOpens(this.IDCFilter).subscribe((data)=>{       
          //     console.log('valor de data'+data.eR);
               this.eO= data.eO;
             });*/

        //let o= this.obteniendoOpens();
         // let newo= JSON.stringify(o);
         //this.enviados= this.miC.countDeliverys;
        console.log('valor de eO antes de update'+this.result);
/*
        this.req = { 
          IDC:this.IDCFilter,
          countDeliverys:this.eDNew,
          countRejects:2,
          countOpens: this.eO,
          countClicks:2,
    
    
        };
        this.actualizando(this.req);
      */
    
        //this.pieChartData=[this.enviados,2,0];
      }

      //var milistas:Lista[]=[]= data.data;
      //var listas = data.data;
      //console.log("data list: " + JSON.stringify(this.listas));
          
    });
    this.obtenerActualizado();
 
  /*this.listService.cargarListas().subscribe((listas)=>{

   
    //this.cargando= false;
    this.listas= listas;
    console.log(listas);
  });*/
};
async obteniendoOpens(){
  await this.res.getEmailsOpens(this.IDCFilter).subscribe((data)=>{       
    console.log('IDCFilter en getEmailsOpens'+this.IDCFilter);
    this.eO= data.eO;
    console.log('EmailsOpens obtenidos'+this.eO);
   
  });
  return this.eO;
  
};

async Opens(request) {
  let it = this;

  return new Promise(async function (resolve, reject) {
      it.res.getEmailsOpens(request).subscribe((data) => {
        resolve(data);
      
      });
    

  });
}
async actualizando(req){
  await this.updateCampaigPRO(req);

};
obtenerActualizado(){

  this.res.getCampanias().subscribe((data)=>{
    this.campanias = data.campaigns;
     this.campaignsFilter2= this.campanias.filter(l => l.companyId === this.mycompany);
    });
}
  }

   


   


