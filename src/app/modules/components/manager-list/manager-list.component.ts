import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RestService } from 'src/app/rest.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import {Lista} from 'src/app/_models/listaModel';
@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.css']
})
export class ManagerListComponent implements OnInit {
  public headers: any[] = [];
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentList: Observable<Lista>;
  user: User;
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
  
    panelOpenState = false;
  
  
  constructor(private datePipe: DatePipe, public rest: RestService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    
    // redirect to home if already logged in
    this.user = this.currentUserSubject.value;
    

    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol != 'admin') {
      this.router.navigate(['/']);
    }
    

  }
  
  

  ngOnInit(): void {
  }


  // LOAD CSV FILE FROM INPUT
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
          console.log("--------<<<<<<<<<<------");
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
    console.log("csvArr.length: " + this.csvArr.length);
    let query = {};
    //console.log("request -->: " + JSON.stringify(this.request));

    //upload filters in DB
    let filterRequest = {
      query: {
        id: "filters",
        filters: this.headers
      }
    }
    this.rest.setFilters(filterRequest).subscribe((data) => {
      console.log("data filters: " + JSON.stringify(data));
      console.log("complete filters.....");

    });

    for (let i = 0; i < this.csvArr.length; i++) {
      let client = this.csvArr[i]
      query["EMAIL"] = client.EMAIL;
      client.BLACK= false;
      this.request = {
        query: query
      }
      this.rest.getClients(this.request).subscribe((data) => {
        let clients = data.clients;
        
        console.log("getClients -->: " + JSON.stringify(clients));
        if (clients.length == 0) {
          for (let i = 0; i < this.csvArr.length; i++) {
            let client = this.csvArr[i];
            this.creationDate = new Date();
            client.BLACK= false;
            client.FECHA_CREACION = this.transformDate(this.creationDate);
          }
          console.log("client: " + JSON.stringify([client]));

          this.rest.addClients([client]).subscribe((data) => {
            //console.log("addData: " + JSON.stringify(data));
            if (data.success) {
              console.log("complete.....");
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
          
          //console.log("client -->: " + JSON.stringify(client._id));
          this.rest.upsertClients(client).subscribe((data) => {
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
