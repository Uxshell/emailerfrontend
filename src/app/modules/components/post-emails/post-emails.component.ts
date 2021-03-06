import { Component, OnInit, ViewContainerRef, ViewChild, Input , ElementRef,ViewChildren} from '@angular/core';
import { DashboardService } from '../../dashboardServices';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RestService } from 'src/app/rest.service';
import { Papa } from 'ngx-papaparse';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import { AlertComponent } from 'src/app/_alerts/alert/alert.component';
import { MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
//import {Lista} from '../_models/listaModel';
import {Lista} from '../../../_models/listaModel';
import { MatListItem } from '@angular/material/list';
import { faHorseHead } from '@fortawesome/free-solid-svg-icons';
import { Campaign } from 'src/app/_models/campaignModel';


@Component({
  selector: 'app-post-emails',
  templateUrl: './post-emails.component.html',
  styleUrls: ['./post-emails.component.css']
})
export class PostEmailsComponent implements OnInit {
  @ViewChild('campaignLabel') campaignLabel: MatInput;
  @ViewChild('subjectLabel') subjectLabel: MatInput;
//para tags
allFruits: string[] = []; //header
//public allFruits: any[] = [];
public fruits: string[]=['Nombre'];
public seleccionada: string;
public ID_USER:string='';
public ID_LISTA:string='';
hoy= new Date().toLocaleDateString(); 

campania: Campaign;
//para programados
/*mes:number = 10;
dia = 14;
hora = 12;
minutos = 09;
segundos = 0;*/
visible = true;
selectable = true;
removable = true;
separatorKeysCodes: number[] = [ENTER, COMMA];
fruitCtrl = new FormControl();
maxDate = new Date();
miniDate  = new Date();
filteredFruits: Observable<string[]>;
disableSelect = new FormControl(false);
@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild("miTime") myNameElem: ElementRef;
//termina tags
  date = new FormControl(new Date());
  initDate = null;
  finalDate = null;
  hasName: boolean = false;
  request;
  subject;
  remitente;
  filterHeader: string;
  public timeEnvio;
  public doh:number;
  public dom:number;
  public   IDListaFind:string='';
  isCompleted: boolean = false;
  isFinish: boolean = false;
  isError: boolean = false;
  htmlLoaded: boolean = false;
  isProgress: Boolean = false;
  fechaEnvio: Date;
  options = [];
  optionText = new FormControl();
  optionSimbols = new FormControl();
  public listas: Lista[] =[];
  public headers: any[] = [];
  papa: Papa = new Papa();
  header = new FormControl();
  labelInput = new FormControl();
  subjectInput = new FormControl();
  remitenteInput= new FormControl();
  public schedule=false;
  nameValue = "";
  maptypes = new Map();
  checked: boolean;
  filtersHeaders = [];
  localFiltersHeaders = [];
  type: any;
  csvArr = [];
  csvActive = false;
  ID_CAMPAIGN='';
  IDCNew;
  listaFind:Lista;
mirequest={};
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  fileContent: any = '';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  username: string;

  constructor(private datePipe: DatePipe, private dialog: MatDialog, public rest: RestService, private router: Router, private dashboardService: DashboardService) {

    
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = this.currentUserSubject.value;
      this.cargarLista();
     

      //this.process2();
    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol == 'viewer') {
      this.router.navigate(['statistics']);
    }
  
  }

  
  async createCampaigPRO(request) {
    let it = this;
  
    return new Promise(async function (resolve, reject) {
        it.rest.createCampaign(request).subscribe((data) => {

          //console.log("campaña desde Promise: " + data.campaignId);
          
         // this.ID_CAMPAIGN =data.campaignId;
          //console.log('ID_CAMPAIGN desde Data'+this.ID_CAMPAIGN);
          resolve(data.campaignId);
          //localStorage.setItem('campaniaID', JSON.stringify(this.campania._id));
       //  this.user.userId= data.response.campaign.userId;
        });
      

    });
}

  cargarLista(){
    this.ID_USER = localStorage.getItem('userId');
    
    
    console.log('ID_USER recuperado con localStorage'+this.ID_USER);
   
    
    var userId = this.ID_USER.replace(/['"]+/g, '');
    
   
    this.rest.getLists(userId).subscribe((data)=>{

      this.listas = data.listas;
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


  //metodos para Tags
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }
  //termina metodos para Tags

  ngOnInit(): void {
    //let csvTableHeader = ["EMAIL", "NOMBRE", "APELLIDO", "GENERO", "NACIMIENTO", "PAIS", "CONSENTIMIENTO", "ORIGEN", "CALIFICACION", "CURP", "NSS", "SIEFORE", "EDAD", "ESTADOREPUBLICA", "SEGUNDONOMBRE", "SEGUNDOAPELLIDO", "CP", "PLATAFORMA", "TARGET", "HORARIOCONTACTO", "INTERES", "FECHAINGRESO", "ESTADOCIVIL", "DOMICILIOMUNICIPIO", "BIOMETRICO", "RECERTIFICACION", "ESTIDE", "PRIMERAFORE", "AHORROVOLUNTARIO", "TIPOCLIENTE", "AFOREMOVIL", "FECHADEREVERSION", "PAPERLESS", "IMSSISSSTEMIXTO", "SALDOVOL", "SALDORCV", "RENDIMIENTO", "CONTRATO", "RAZONSOCIAL", "EJECUTIVO", "CONTACTO", "FECHACERTIFICACION", "ANTIGUEDADAXXI", "SEGMENTO", "SUBSEGMENTO", "KLICCODIGO", "KLICVALIDO", "FECHACARTAPREFERENTE", "NOMBREEJECUTIVO", "TELEFONOEJECUTIVO", "EXTENSIONEJECUTIVO", "EMAILEJECUTIVO", "MIAFOREDIGITAL", "REFERENCIACIE", "FECHA_CREACION"];

    this.rest.getFilters().subscribe((data) => {
      //console.log("data filters: " + JSON.stringify(data));
      if (data.filters.filters) {
        this.headers = data.filters.filters;
        this.allFruits= this.headers;
        this.buildMapTypes(this.headers);

      }

    });
    //console.log("csvTableHeader: " + csvTableHeader);
    /*
    for (let i = 0; i < csvTableHeader.length; i++) {
      this.headers.push(csvTableHeader[i].toLowerCase());
    }
    //*/
    this.isFinish = true;
  }


  htmlInputChange(fileInputEvent: any) {
    this.nameValue = this.labelInput.value;
    this.onChange(fileInputEvent.target.files[0]);
  }
  

  public onChange(file: File): void {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.fileContent = fileReader.result;
      this.htmlLoaded = true;
    }
    fileReader.readAsText(file);

  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  removeInput(index) {
    this.filtersHeaders.splice(index, 1)
    this.localFiltersHeaders.splice(this.header.value)
  }
 process2(){
  this.rest.searchLista( this.seleccionada ).subscribe( (data) => {
    
    //console.log('_id de lista antes de'+resp.lista._id);
    this.IDListaFind=data.lista.ID;
    
    console.log('Process2'+this.IDListaFind);
  })
 }

  processData() {

    this.isProgress = true;
    let query = {};
    if (!this.labelInput.value) {
      this.showAlert("Error", "Se necesita un nombre de campaña");
      this.campaignLabel.focus();
      return;
    }
    for (let i = 0; i < this.filtersHeaders.length; i++) {
      let header = this.filtersHeaders[i].value;
      let option = this.filtersHeaders[i].option;
      let value = this.filtersHeaders[i].controlInput.value;
      let type = this.filtersHeaders[i].type;

      let formQ = {};
      if (type == "text") {
        switch (option) {
          case "contiene":
            formQ["$regex"] = ".*" + value + ".*";
            break;
          case "igual":
          default:
            formQ = value;
            break;
        }

      }
      else if (type == "number") {
        switch (option) {
          case "menor":
            formQ["$lt"] = value;
            break;
          case "mayor":
            formQ["$gt"] = value;
            break;
          case "igual":
            formQ["$eq"] = value;
            break;
          default:
            formQ = value;
            break;
        }
      }
      else if (type == "checkbox") {
        if (header == "genero") {
          if (option == "true") {
            option = "m";
          } else {
            option = "f"
          }
        } else {
          if (option == "true") {
            option = "verdadero";
          } else {
            option = "falso"
          }
        }
        formQ = option;
      }
      else if (type == "date") {
        //{"FECHA_CREACION":{"$gte": "2020-07-05", "$lte": "2020-07-11"}} example
        formQ["$gte"] = this.initDate;
        formQ["$lte"] = this.finalDate;
      }
      query[header.toUpperCase()] = formQ;
      //console.log("QUERY: " + JSON.stringify(query));
    }
    this.request = {
      query: query
    };

    //console.log("request -->: " + JSON.stringify(this.request));
    //obtenemos todos los clientes de la BD
    
   
    this.rest.getClients(this.request).subscribe((data) => {
      let emails = [];
      let total = 0;
      let clients = [];
      let client = {};
        
    
      
      
      
      
      if (data.clients.length > 0) {//existen clientes en la BD
        let obj = data.clients;
        total = data.total;
        console.log('ID_USER:::'+this.ID_USER.replace(/['"]+/g, '')+'IDListaFind'+this.IDListaFind);
        let IDUserParse= this.ID_USER.replace(/['"]+/g, '');
        for (let i = 0; i < data.clients.length; i++) {
          let client = {};
          let obj = data.clients[i];
          //console.log("obj: " + JSON.stringify(obj));
            //obj.ID_LISTA==''
          if(obj.BLACK==false &&obj.USER_ID==IDUserParse && obj.ID_LISTA==this.IDListaFind){
            //falta lista
          
            let email = {};
            email["email"] = obj.EMAIL;
            if (email) {
              emails.push(email);
            }
            this.nameValue = obj.NOMBRE;
            client = { name: obj.NOMBRE, email: obj.EMAIL };
            clients.push(client);
        }else{
          console.log('NO MATCH TO LIST');
        }
          //break;
        }

        this.sendEmail(clients, emails);
        
        
        //*/


      }
      else {
        this.isProgress = false;
        this.showAlert("Emails", "No se encontraron coincidencias");
      }
    });

  }
  

  async getIdLista(request){
    await this.rest.searchLista(request).subscribe((data) => {
      this.listaFind= data.lista;
      let listTemp= JSON.stringify(this.listaFind);
      
      console.log('idLista obtenido'+JSON.stringify(this.listaFind));
      console.log('listTemp'+listTemp);
    });

  };
  
  async getUserByEmail(request, headers) {
    let it = this;
    return new Promise(async function (resolve, reject) {
        it.rest.getUserByEmail(request, headers).subscribe((data) => {
       //     console.log("RESPONSE..." + JSON.stringify(data));
            resolve(data);
        });
    });
}


  createCampaig(query, emails) {
    let request = {
      name: this.labelInput.value,
      creationDate: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
   //   filters: JSON.stringify(query),
    //  sentEmails: emails.length,
      subject: this.subjectInput.value,


    };

      
    this.rest.createCampaign(request).subscribe((data) => {

      console.log("campaña: " + data.campaignId);
      
      this.ID_CAMPAIGN =data.campaignId;
      this.IDCNew = this.ID_CAMPAIGN.replace(/['"]+/g, '');
      console.log('ID_CAMPAIGN desde Data'+this.ID_CAMPAIGN);
      localStorage.setItem('campaniaID', JSON.stringify(this.campania._id));
   //  this.user.userId= data.response.campaign.userId;
    });
    return this.IDCNew;
  }


  async sendEmail(clients, emails) {
    //let cron = require('node-cron');
    let html = this.fileContent;
    let subject = this.subjectInput.value;
    let remitente = this.remitenteInput.value;
    let tagsforHtml = this.fruits;
    let fechaparaEnvio = this.fechaEnvio;
    let programado = this.schedule;
    let companyRe=localStorage.getItem('company');
    var companyParse = companyRe.replace(/['"]+/g, '');
 
    let req = {
      name: this.labelInput.value,
      creationDate: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
      sentEmails: emails.length,
      companyId: companyParse,
      countSends:0,
      countDeliverys:0,
      countRejects:0,
      countOpens:0,
      countClicks:0,
      


    };

    let c  =await this.createCampaigPRO(req);
    console.log("Valor de ID_CAMPAIGN en sendEmail"+c);
    var cString= JSON.stringify(c);
    localStorage.setItem('IDCampaign', JSON.stringify(c));
    let newc =cString.replace(/['"]+/g, '');
    console.log('cString en bruto'+cString);
    let ID_C = localStorage.getItem('IDCampaign');
    
    console.log('ID campaign desde localStorage'+ID_C);
  
    let request = {
      "subject": subject,
      "remitente": remitente,
      "clients": clients,
      "html": html,
      "tags": tagsforHtml,
      "fecha": fechaparaEnvio,
      "scheduleDef": programado,
      "campaign": newc,
    }
    if(programado == true){
      const dialoSchedule = new MatDialogConfig();
      let messageS = "El envío de correos se hará: " + fechaparaEnvio;

      dialoSchedule.data = {
        title: 'Envío programado',
        message: messageS
      };
      let dialogRef = this.dialog.open(AlertComponent, dialoSchedule);
      dialogRef.afterClosed().subscribe(result => {
        this.isProgress = false;
        if (result == 'confirm') {
          this.ngOnInit();
          
         // this.router.navigate(["/"]);
        }
      })
      this.rest.activeSchedule(request).subscribe((data) => {
        this.isProgress = false;
        //this.router.navigate(["/"]);
        if (data.statusCode === 200) {
          const dialogConfig = new MatDialogConfig();
          let message = "Se enviaron: " + emails.length + " correos programados";
  
          dialogConfig.data = {
            title: 'Emails',
            message: message
          };
  
          let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {
            this.isProgress = false;
            if (result == 'confirm') {
              this.ngOnInit();
              this.router.navigate(["/"]);
            }
          })
        }
        else {
        //  console.error("ocurrio un error en el envio")
          //this.showAlert("Error", "ocurrio un error en el envio");
        }
      });
    }else{
 this.rest.activeLambdaMassiveEmailer(request).subscribe((data) => {
      
  this.isProgress = false;
    //  console.log(JSON.stringify(data));
    
      if (data.statusCode === 200) {
        const dialogConfig = new MatDialogConfig();
        let message = "Se enviaron: " + emails.length + " correos electrónicos";

        dialogConfig.data = {
          title: 'Emails',
          message: message
        };

        let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          this.isProgress = false;
          if (result == 'confirm') {
            this.ngOnInit();
            this.router.navigate(["/"]);
          }
        })
      }
      else {
        console.error("ocurrio un error en el envio")
        this.showAlert("Error", "ocurrio un error en el envio");
      }
    });
  }
};

  showAlert(tittle, message) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: tittle,
      message: message
    };

    let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.ngOnInit();
        this.router.navigate(["/"]);
      }
    })
  }


  addTag() {
    //Add Tag Nombre
    let currectValue = this.subjectInput.value;
    if (currectValue == null) {
      currectValue = "";
    }
    this.subjectLabel.value = currectValue + '[[[Nombre]]]';
    this.subjectInput.setValue(this.subjectLabel.value);
    //Add tags in future
  }
  getIDL(){


this.rest.searchLista(this.seleccionada).subscribe((data)=>{
  console.log('search List'+data.idlista);
  this.IDListaFind=data.idlista;
});
  }
  addFilter() {
    //console.log("selected: " + this.header.value);
    if (this.header.value != null && !this.localFiltersHeaders.includes(this.header.value)) {
      this.filterHeader = this.header.value;
      let type = this.maptypes.get(this.header.value);

      if (type == "date") {
        this.filtersHeaders.push({
          value: this.filterHeader, type: type, option: this.date.value, controlInput: new FormControl()
        });
      }
      else {
        this.filtersHeaders.push({
          value: this.filterHeader, type: type, option: this.selected, controlInput: new FormControl()
        });
      }
      this.localFiltersHeaders.push(this.header.value);
    }


  }

  buildMapTypes(headers) {
    //se construyen estaticamente los filtros
    for (let i = 0; i < headers.length; i++) {
      switch (headers[i]) {
        case "genero" || "consentimiento":
          this.maptypes.set(headers[i], "checkbox");
          break;
        case "calificacion" || "edad" || "saldovol" || "saldorcv":
          this.maptypes.set(headers[i], "number");
          break;
        case "fechaingreso" || "fechadereversion" || "fechacertificacion"
          || "fechacartapreferente" || "fecha_creacion":
          this.maptypes.set(headers[i], "date");
          break;
        default:
          this.maptypes.set(headers[i], "text");
          break;
      }
    }
    
  }

  insertList() {
    this.csvActive = true;
  }
  getValueT() {
    /* this.timeEnvio = this.myNameElem.nativeElement.value;
     console.log(this.timeEnvio);*/
     const stringTime = this.myNameElem.nativeElement.value;
      this.doh = stringTime.substring(0,2);
      this.dom = stringTime.substring(3,6);
      this.schedule = true;
     //console.log("HORA"+this.doh+"MINUTE"+this.dom);
     
 }

  updateDOB(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    
    const stringified = JSON.stringify(dateObject.value);
    //console.log("valor de stringified en postantes de "+stringified);
    const dob = stringified.substring(1, 11);
    this.initDate = dob;
    //var year = stringified.substring(1, 5);
    
    var splitted = dob.split("-", 3);
    var m: number = +splitted[1];
    var y: number = +splitted[0];
    var d: number = +splitted[2];
    m = m -1;

  this.fechaEnvio = new Date(y, m, d, this.doh, this.dom, 0);
    //console.log("fechaEnvio"+this.fechaEnvio);
  }
 


  formDate(event) {
    const stringified = JSON.stringify(event.value);
    const dob = stringified.substring(1, 11);

    this.finalDate = dob;
    //console.log("finalDate: " + this.finalDate);

  }



  

}
