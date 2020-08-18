import { Component, OnInit, ViewContainerRef, ViewChild, Input } from '@angular/core';
import { DashboardService } from '../../dashboardServices';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RestService } from 'src/app/rest.service';
import { Papa } from 'ngx-papaparse';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/_alerts/alert/alert.component';
import { MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-post-emails',
  templateUrl: './post-emails.component.html',
  styleUrls: ['./post-emails.component.css']
})
export class PostEmailsComponent implements OnInit {
  @ViewChild('campaignLabel') campaignLabel: MatInput;
  @ViewChild('subjectLabel') subjectLabel: MatInput;

  date = new FormControl(new Date());
  initDate = null;
  finalDate = null;

  selected = 'option1';
  hasName: boolean = false;
  request;
  subject;
  filterHeader: string;
  maxDate = new Date();
  isCompleted: boolean = false;
  isFinish: boolean = false;
  isError: boolean = false;
  htmlLoaded: boolean = false;
  isProgress: Boolean = false;

  options = [];
  optionText = new FormControl();
  optionSimbols = new FormControl();

  public headers: any[] = [];
  papa: Papa = new Papa();
  header = new FormControl();
  labelInput = new FormControl();
  subjectInput = new FormControl();
  nameValue = "";
  maptypes = new Map();
  checked: boolean;
  filtersHeaders = [];
  localFiltersHeaders = [];
  type: any;
  csvArr = [];
  csvActive = false;

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;

  fileContent: any = '';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  username: string;

  constructor(private datePipe: DatePipe, private dialog: MatDialog, public rest: RestService, private router: Router, private dashboardService: DashboardService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = this.currentUserSubject.value;

    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol == 'viewer') {
      this.router.navigate(['statistics']);
    }
  }

  ngOnInit(): void {
    //let csvTableHeader = ["EMAIL", "NOMBRE", "APELLIDO", "GENERO", "NACIMIENTO", "PAIS", "CONSENTIMIENTO", "ORIGEN", "CALIFICACION", "CURP", "NSS", "SIEFORE", "EDAD", "ESTADOREPUBLICA", "SEGUNDONOMBRE", "SEGUNDOAPELLIDO", "CP", "PLATAFORMA", "TARGET", "HORARIOCONTACTO", "INTERES", "FECHAINGRESO", "ESTADOCIVIL", "DOMICILIOMUNICIPIO", "BIOMETRICO", "RECERTIFICACION", "ESTIDE", "PRIMERAFORE", "AHORROVOLUNTARIO", "TIPOCLIENTE", "AFOREMOVIL", "FECHADEREVERSION", "PAPERLESS", "IMSSISSSTEMIXTO", "SALDOVOL", "SALDORCV", "RENDIMIENTO", "CONTRATO", "RAZONSOCIAL", "EJECUTIVO", "CONTACTO", "FECHACERTIFICACION", "ANTIGUEDADAXXI", "SEGMENTO", "SUBSEGMENTO", "KLICCODIGO", "KLICVALIDO", "FECHACARTAPREFERENTE", "NOMBREEJECUTIVO", "TELEFONOEJECUTIVO", "EXTENSIONEJECUTIVO", "EMAILEJECUTIVO", "MIAFOREDIGITAL", "REFERENCIACIE", "FECHA_CREACION"];
    this.rest.getFilters().subscribe((data) => {
      console.log("data filters: " + JSON.stringify(data));
      if (data.filters.filters) {
        this.headers = data.filters.filters;
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

    console.log("request -->: " + JSON.stringify(this.request));

    this.rest.getClients(this.request).subscribe((data) => {
      let emails = [];
      let total = 0;
      let clients = [];
      let client = {};

      console.log(data.clients.length);
      if (data.clients.length > 0) {
        let obj = data.clients;
        total = data.total;
        for (let i = 0; i < data.clients.length; i++) {
          let client = {};
          let obj = data.clients[i];
          //console.log("obj: " + JSON.stringify(obj));
          if(obj.BLACK==false){
          let email = {};
          email["email"] = obj.EMAIL;
          if (email) {
            emails.push(email);
          }
          this.nameValue = obj.NOMBRE;
          console.log("name: " + this.nameValue);
          client = { name: obj.NOMBRE, email: obj.EMAIL };
          clients.push(client);
        }else{
          console.log('un black');
        }
          //break;
        }
        //console.log("emails Arr: " + JSON.stringify(emails));
        //this.sendEmail(emails);
        this.sendEmail(clients, emails);
        this.createCampaig(query, emails);
        //*/


      }
      else {
        this.isProgress = false;
        this.showAlert("Emails", "No se encontraron coincidencias");
      }
    });

  }

  createCampaig(query, emails) {
    let request = {
      name: this.labelInput.value,
      creationDate: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
      filters: JSON.stringify(query),
      sentEmails: emails.length,
      subject: this.subjectInput.value,

    };


    this.rest.createCampaign(request).subscribe((data) => {
      console.log("campaña: " + data.campaignId);
    });
  }


  sendEmail(clients, emails) {
    let html = this.fileContent;
    let subject = this.subjectInput.value;
    //console.log(html);
    console.log("subject: " + subject);
    let it = this;
    let request = {
      "subject": subject,
      "clients": clients,
      "html": html
    }

    this.rest.activeLambdaMassiveEmailer(request).subscribe((data) => {
      this.isProgress = false;
      console.log(JSON.stringify(data));
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
    /*
    this.maptypes.set("email", "text");
    this.maptypes.set("nombre", "text");
    this.maptypes.set("apellido", "text");
    this.maptypes.set("genero", "checkbox");
    this.maptypes.set("nacimiento", "text");
    this.maptypes.set("pais", "text");
    this.maptypes.set("consentimiento", "checkbox");
    this.maptypes.set("origen", "text");
    this.maptypes.set("calificacion", "number");
    this.maptypes.set("curp", "text");
    this.maptypes.set("nss", "text");
    this.maptypes.set("siefore", "text");
    this.maptypes.set("edad", "number");
    this.maptypes.set("estadorepublica", "text");
    this.maptypes.set("segundonombre", "text");
    this.maptypes.set("segundoapellido", "text");
    this.maptypes.set("cp", "text");
    this.maptypes.set("plataforma", "text");
    this.maptypes.set("target", "text");
    this.maptypes.set("horariocontacto", "text");
    this.maptypes.set("interes", "text");
    this.maptypes.set("fechaingreso", "date");
    this.maptypes.set("estadocivil", "text");
    this.maptypes.set("domiciliomunicipio", "text");
    this.maptypes.set("biometrico", "text");
    this.maptypes.set("recertificacion", "text");
    this.maptypes.set("estide", "text");
    this.maptypes.set("primerafore", "text");
    this.maptypes.set("ahorrovoluntario", "text");
    this.maptypes.set("tipocliente", "text");
    this.maptypes.set("aforemovil", "text");
    this.maptypes.set("fechadereversion", "date");
    this.maptypes.set("paperless", "text");
    this.maptypes.set("imssissstemixto", "text");
    this.maptypes.set("saldovol", "number");
    this.maptypes.set("saldorcv", "number");
    this.maptypes.set("rendimiento", "text");
    this.maptypes.set("contrato", "text");
    this.maptypes.set("razonsocial", "text");
    this.maptypes.set("ejecutivo", "text");
    this.maptypes.set("contacto", "text");
    this.maptypes.set("fechacertificacion", "date");
    this.maptypes.set("antiguedadaxxi", "text");
    this.maptypes.set("segmento", "text");
    this.maptypes.set("subsegmento", "text");
    this.maptypes.set("kliccodigo", "text");
    this.maptypes.set("klicvalido", "text");
    this.maptypes.set("fechacartapreferente", "date");
    this.maptypes.set("nombreejecutivo", "text");
    this.maptypes.set("telefonoejecutivo", "text");
    this.maptypes.set("extensionejecutivo", "text");
    this.maptypes.set("emailejecutivo", "text");
    this.maptypes.set("miaforedigital", "text");
    this.maptypes.set("referenciacie", "text");
    this.maptypes.set("fecha_creacion", "date");
    //*/
  }

  insertList() {
    this.csvActive = true;
  }

  updateDOB(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    const stringified = JSON.stringify(dateObject.value);
    const dob = stringified.substring(1, 11);

    this.initDate = dob;
    //console.log("initDate: " + this.initDate);
  }

  formDate(event) {
    const stringified = JSON.stringify(event.value);
    const dob = stringified.substring(1, 11);

    this.finalDate = dob;
    //console.log("finalDate: " + this.finalDate);

  }

}
