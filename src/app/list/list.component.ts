import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { BehaviorSubject, Observable } from 'rxjs';
import{RestService} from '../rest.service';
import { ListaService } from '../_services/listaService';
import{ClienteService} from '../_services/clienteService';
import {Lista} from '../_models/listaModel';
import { User } from 'src/app/_models/user';
import {Cliente} from '../_models/clienteModel';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import {CompanyService} from '../_services/companyService';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public IDLISTA_generado:string='';
  public ID_USER:string;
  public headers: any[] = [];
  addresses = [];
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentList: Observable<Lista>;
 public user: User;
  lista: Lista;
  isCompleted: boolean = false;
  finishLoad:boolean = false;
  isFinish: boolean = false;
  isError: boolean = false;
  htmlLoaded: boolean = false;
  csvArr = [];
  selectedCSVFileName: any;
  papa: Papa = new Papa();
  isCSV_Valid: boolean;
  emailsArr = [];
  request = {};
  creationDate: any;
  l:Lista;
  mirequest = {};

    panelOpenState = false;

public listas: Lista[] =[];
public listasFilter: Lista[] =[];
public clientes: Cliente[]= [];
public cargando: boolean = true;

  constructor(private addressService: CompanyService, private listService: ListaService, private cs: ClienteService,public dialog: MatDialog, public res:RestService) { 
   this.cargarLista();
  }
  filterPost ='';

  

  
  
  name: string;
  position: number;
  weight: number;
  symbol: string;

  
  ngOnInit(): void {
   this.cargarLista();
   this.addressService.getAddresses().subscribe((address) => {
    this.addresses = address;
    console.log( this.addresses);
  });
  }
 
  cargarLista(){
    let query = {};
    this.ID_USER = localStorage.getItem('userId');
    var userId = this.ID_USER.replace(/['"]+/g, '');
    console.log('ID_USER recuperado con localStorage'+this.ID_USER);
        
      this.cargando=true;
      this.res.getLists(userId).subscribe((data)=>{
       // this.res.getLists(this.request).subscribe((data)=>{
        this.listas = data.listas;
        //var milistas:Lista[]=[]= data.data;
        //var listas = data.data;
      
        console.log("data list: " + JSON.stringify(this.listas));
        //this.listasFilter= this.listas.filter(l => l.userId === userId);
        console.log("data listasFilter: " + JSON.stringify(this.listasFilter));
            
      });
      
    /*this.listService.cargarListas().subscribe((listas)=>{

      
      //this.cargando= false;
      this.listas= listas;
      console.log(listas);
    });*/
  }


  ClientsbyLista(lista:Lista){
    this.cs.getClientsbyLista(lista._id).subscribe(clientes=>{
     this.clientes =clientes;
      //console.log(this.clientes); 
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
            
            this.cargarLista();
            Swal.fire(
              'Lista borrada',
              `${ lista.nombre } fue eliminado correctamente`,
              'success'
            );
            
          });

      }
    })
  }
crearLista(lista:Lista){


}

  async abrirSweetAlert() {
    let hoy= new Date().toLocaleDateString();  
    console.log('fecha hoy'+hoy);
    
    const { value = '' } = await Swal.fire<string>({
      title: 'Nueva lista',
      text: 'Ingrese el nombre de la nueva lista',
      input: 'text',
      inputPlaceholder: 'Nombre de la lista',
      showCancelButton: true,
    });
    
    this.ID_USER = localStorage.getItem('userId');
    var userId = this.ID_USER.replace(/['"]+/g, '');
    let req={
      nombre:value,
      userId: userId,
      fechaCreacion: hoy,
    }
   // let datoUsuario = JSON.parse(localStorage.getItem('usuario'));
    this.creationDate = new Date();
    if( value.trim().length > 0 ) {
      this.res.crearLista( req )

      //this.res.getClients(this.request).subscribe((data) => {
      .subscribe( (resp: any) => {
        this.listas.push( resp.lista._id )
        //console.log('_id de lista antes de'+resp.lista._id);
        this.IDLISTA_generado=resp.lista._id.toString();
        console.log(resp.lista._id.toString());
      })

    }
  }


  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.csvArr = [];
    this.headers = [];

    if (files !== null && files !== undefined && files.length > 0) {
      this.selectedCSVFileName = files[0].name;
      this.isError = false;
      this.isCompleted = true;
      const reader: FileReader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = e => {

        const csv = reader.result;
        const results = this.papa.parse(csv as string, { header: false });

        // VALIDATE PARSED CSV FILE
        if (results !== null && results !== undefined && results.data !== null &&
          results.data !== undefined && results.data.length > 0 && results.errors.length === 0) {
          this.isCSV_Valid = true;

          // PERFORM OPERATIONS ON PARSED CSV
          let csvTableHeader = results.data[0];
          //console.log("csvTableHeader: " + csvTableHeader);
          for (let i = 0; i < csvTableHeader.length; i++) {
            this.headers.push(csvTableHeader[i].toLowerCase());
          }
          //console.log("headers: " + this.headers);


          let csvTableData = [...results.data.slice(1, results.data.length)];

          //console.log("size csvTableData: " + csvTableData.length);
          //console.log("results.data.length: " + results.data.length);
          for (let i = 0; i < csvTableData.length; i++) {
            if (csvTableData[i][0]) {
              //let csvRecord: CSVRecord = new CSVRecord();
              let clientObj = {};
              for (let y = 0; y < csvTableHeader.length; y++) {
                let headerName = csvTableHeader[y];
                //console.log("item-i-0: " + csvTableData[i][y]);
                //let item = csvTableData[i][y].toLowerCase().trim();
                let item = csvTableData[i][y];
                clientObj[headerName] = item;
                //console.log("headerName: " + headerName);
                if (headerName == "EMAIL") {
                  let jsonEmail = { "email": item };
                  this.emailsArr.push(jsonEmail);
                }
                //headerName == 'idLista'
              }
              this.csvArr.push(clientObj);
            }
          }


          //*/
          this.isCompleted = false;
          this.isFinish = true;
          //console.log(JSON.stringify(clientObj));
          
          //break;



          //*/
        } else {
          this.isError = true;
          this.isCompleted = false;
          this.isFinish = false;
          console.error("no es CSV")
          for (let i = 0; i < results.errors.length; i++) {
            //console.log('Error Parsing CSV File: ', results.errors[i].message);
          }
        }
      };
    } else {
      this.isError = true;
      console.log('No File Selected');
    }

  }


  upload() {
    
    let query = {};
    

    //upload filters in DB
    let filterRequest = {
      query: {
        id: "filters",
        filters: this.headers
      }
    }
    this.res.setFilters(filterRequest).subscribe((data) => {
      //console.log("data filters: " + JSON.stringify(data));
      //console.log("complete filters.....");

    });
    //this.ID_USER = JSON.parse(localStorage.getItem('userId'));

   
   

    for (let i = 0; i < this.csvArr.length; i++) {
      let client = this.csvArr[i]
      query["EMAIL"] = client.EMAIL;
      client.BLACK= false;
      client.ID_LISTA=this.IDLISTA_generado;
      client.USER_ID= this.ID_USER.replace(/['"]+/g, '');
      //console.log('IDlistagenerado desde upload'+this.IDLISTA_generado);
      this.request = {
        query: query
      }
      this.res.getClients(this.request).subscribe((data) => {
        let clients = data.clients;
        //console.log("getClients -->: " + JSON.stringify(clients));
        if (clients.length == 0) {
          for (let i = 0; i < this.csvArr.length; i++) {
            let client = this.csvArr[i];
            client.BLACK= false;
            client.ID_LISTA=this.IDLISTA_generado;
            client.USER_ID= this.ID_USER;
       
            
            //client.FECHA_CREACION = this.transformDate(this.creationDate);
          }
          //console.log("client: " + JSON.stringify([client]));

          this.res.addClients([client]).subscribe((data) => {
            //console.log("addData: " + JSON.stringify(data));
            if (data.success) {
           //   console.log("complete.....");
              this.finishLoad = true;
              this.isCompleted = false;
              this.isFinish = true;
            } else {
              console.error("error load");
              this.isError = true;
            }
          });
        }
        else {
          //client._id = clients[0]._id;
          //client.BLACK= true;
          //client.IDLISTA=this.IDLISTA_generado;
          //client.IDLISTA = ;
          //console.log("client -->: " + JSON.stringify(client._id));
          this.res.upsertClients(client).subscribe((data) => {
            if (data.success) {
          //    console.log("complete upsert.....");
              this.finishLoad = true;
              this.isCompleted = false;
              this.isFinish = true;
            } else {
              console.error("error load");
              this.isError = true;
            }
          });
        }
      });
    }

  }

}


