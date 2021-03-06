import { Component, OnInit , NgZone} from '@angular/core';
import {Black} from '../_models/blackModel';
import {BlackService} from '../_services/blackService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import { Papa } from 'ngx-papaparse';
import { RestService } from 'src/app/rest.service';

import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { SlowBuffer } from 'buffer';
@Component({
  selector: 'app-black',
  templateUrl: './black.component.html',
  styleUrls: ['./black.component.css']
})
export class BlackComponent implements OnInit {
  //Para csv
  public headers: any[] = [];
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentList: Observable<Black>;
  user: User;
  lista: Black;
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
    panelOpenState = false;
  //termina para CSV
  submitted = false;
  blackForm: FormGroup;

  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  public blacks: Black[] =[];

  constructor(private BS:BlackService, public fb: FormBuilder, private datePipe: DatePipe, public res: RestService, private router: Router, private ngZone: NgZone) {
    this.mainForm();
    this.res.getBlacks().subscribe((data)=>{
      this.blacks = data.listas;//importante data.[nombre definido en el backend]
      
      //console.log("data blacks: " + JSON.stringify(this.blacks));
          
    });
  }
  
  mainForm() {
    this.blackForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      fechaCreacion: [''],
      
      
    
    })
  }

  ngOnInit(): void {
  //this.cargarLista();
  }
  
  cargarLista(){

    
    /*this.BS.cargarBlacks().subscribe(listas=>{
      this.blacks= listas;
      console.log(listas);
    });*/
  }
  crearLista(lista:Black){
   this.BS.crearBlack(lista);
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
      this.res.crearBlack( value )
      
      //this.res.getClients(this.request).subscribe((data) => {
      .subscribe( (resp: any) => {
       // this.listas.push( resp.lista._id )
        //console.log('_id de lista antes de'+resp.lista._id);
        //this.IDLISTA_generado=resp.lista._id.toString();

      })

    }
  }
  
  borrarLista(lista: Black){
    Swal.fire({
      title: '¿Borrar lista?',
      text: `Se eliminará el registro de la lista pero está acción no afectará el registro de Clientes en la Base de datos`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        this.BS.eliminarLista( lista._id )
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
  onSubmit() {
    
    
    this.submitted = true;
    if (!this.blackForm.valid) {
      return false;
    } else {
      // this.BS.crearBlack(this.blackForm.value)
      this.res.crearBlack( this.blackForm.value )
     .subscribe(
      //apiService.createEmployee(this.employeeForm.value).subscribe(
        (res) => {
          //console.log('Blacks successfully created!')
          this.ngZone.run(() => this.router.navigateByUrl('/black'))
        }, (error) => {
          console.log(error);
        });
    }
  }
/*
  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nueva lista',
      text: 'Ingrese el nombre de la nueva lista',
      input: 'text',
      inputPlaceholder: 'Nombre de la lista',

      showCancelButton: true,
    });
    
    if( value.trim().length > 0 ) {
      this.BS.crearBlack( value )
        .subscribe( (resp: any) => {
          this.listas.push( resp.lista )
        })
    }
  }
*/
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
          console.log("headers: " + this.headers);


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
          //console.log("--------<<<<<<<<<<------");
          //break;



          //*/
        } else {
          this.isError = true;
          this.isCompleted = false;
          this.isFinish = false;
          console.error("no es CSV")
          for (let i = 0; i < results.errors.length; i++) {
            console.log('Error Parsing CSV File: ', results.errors[i].message);
          }
        }
      };
    } else {
      this.isError = true;
      console.log('No File Selected');
    }

  }
  

  upload() {
    
    //console.log("csvArr.length: " + this.csvArr.length);
    let query = {};
    //console.log("request -->: " + JSON.stringify(this.request));

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

    for (let i = 0; i < this.csvArr.length; i++) {
      let client = this.csvArr[i]
      query["EMAIL"] = client.EMAIL;
      //client.BLACK= true;
      this.request = {
        query: query
      }
      this.res.getClients(this.request).subscribe((data) => {
        let clients = data.clients;
        //console.log("getClients -->: " + JSON.stringify(clients));
        if (clients.length == 0) {
          for (let i = 0; i < this.csvArr.length; i++) {
            let client = this.csvArr[i];
            client.BLACK= true;
            this.creationDate = new Date();
            //client.FECHA_CREACION = this.transformDate(this.creationDate);
          }
          //console.log("client: " + JSON.stringify([client]));

          this.res.addClients([client]).subscribe((data) => {
            //console.log("addData: " + JSON.stringify(data));
            if (data.success) {
            //  console.log("complete.....");
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
          client._id = clients[0]._id;
          //client.BLACK= true;
          //console.log("client -->: " + JSON.stringify(client._id));
          this.res.upsertClients(client).subscribe((data) => {
            if (data.success) {
              console.log("complete upsert.....");
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

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

}





