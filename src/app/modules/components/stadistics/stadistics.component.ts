import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../dashboardServices';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { RestService } from 'src/app/rest.service';
import { DataService } from "./DataService";
import { FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/_alerts/alert/alert.component';


@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css']
})
export class StadisticsComponent implements OnInit {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  data = [];
  pieChartOpened = [];
  pieChartDelivery = [];

  title = "";

  cards = [];
  numEmails
  valueGlobal;

  bounces = 0;
  complaints = 0;
  emailTotal = 0;
  clicks = 0;
  open = 0;
  bounce = 0;
  delivery = 0;
  undelivery = 0;
  rejects = 0;
  send = 0;

  dialogConfig = new MatDialogConfig();

  percentDelivery = 0.0;
  percentReject = 0.0;
  percentOpen = 0.0;
  percentClick = 0.0;
  percentBounce = 0.0;
  percentNODelivery = 0.0;

  date = new FormControl(new Date());
  minDate: Date;
  initDate = null;
  finalDate = null;
  maxDate = new Date();
  responseData = {};
  //prueba de formateo fecha
  year = null;
  month =null;
  day =null;

  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  isProgress: Boolean = false;

  greeting: Promise<string> | null = null;
  arrived: boolean = false;

  private resolve: Function | null = null;

  constructor(private dialog: MatDialog, private dataService: DataService, public rest: RestService, private router: Router, private dashboardService: DashboardService) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    // redirect to home if already logged in
    this.user = this.currentUserSubject.value;

    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol == 'sender') {
      this.router.navigate(['/']);
    }


  }


  async ngOnInit() {
    this.user = this.currentUserSubject.value;
    if (this.user === null) {
      this.router.navigate(['login']);
    }
  }

  getPercent(value) {
    let val = (value / this.numEmails) * 100;
    return val//.toFixed(2);

  }

  updateDOB(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    const stringified = JSON.stringify(dateObject.value);
    console.log("valor de stringified antes de "+stringified);
    const dob = stringified.substring(1, 11);
    this.initDate = dob;

    var splitted = dob.split("-", 3);
    var y: number = +splitted[2];
    y = y + 1;
    let dateForm = "" + splitted[0] + "-" + splitted[1] + "-" + y;
    console.log("dateForm:"+dateForm);
    this.minDate = new Date(dateForm)

  }
  
  formateo(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    const stringified = JSON.stringify(dateObject.value);
    const exy = stringified.substring(1, 5);
    this.year = exy;

   /* var splitted = dob.split("-", 3);
    var y: number = +splitted[2];
    y = y + 1;
    let dateForm = "" + splitted[0] + "-" + splitted[1] + "-" + y;
    this.minDate = new Date(dateForm)*/

  }

  formDate(event) {
    //    console.log("initDate: " + this.initDate);

    const stringified = JSON.stringify(event.value);
    const dob = stringified.substring(1, 11);

    this.finalDate = dob;
    //console.log("finalDate: " + this.finalDate);
  }

  doSearch() {

    this.isProgress = true;
    this.responseData = {};
    console.log("valor de initDate:"+this.initDate);
    let request = {
      "startTime": this.initDate + " 00:00:00",

      "endTime": this.finalDate + " 23:59:59",
      "metricName": "emailerSetMetrics"

    }
    
    
    
    console.log("request antes de rest.getAllSta: "+request.endTime);
    this.rest.getAllStatistics(request).subscribe((data) => {
      //console.log("ALL: " + JSON.stringify(data));


      console.log("body STATUS CODE: " + data.response.statusCode);
      console.log("body: " + JSON.stringify(data.response));

      let body = JSON.parse(data.response);
      let newBody = JSON.parse(JSON.stringify(body));
      
      if (newBody["body"]["error"]) {
        console.log("hay error");
        this.isProgress = false;
        this.showAlert("Error de conexión. Intentarlo más tarde");
      }
      else {
        console.log("hay datos de la metrica ");
        let events = ["Click", "Open", "Bounce", "Delivery", "Reject", "Send"]
        let bounceType =[""]

        for (let i = 0; i < events.length; i++) {
          let sum = 0;
          let obj = newBody.body[events[i]];
          let dataPoints = obj.Datapoints;
          
          for (let x = 0; x < dataPoints.length; x++) {
            let sample = dataPoints[x]["SampleCount"];
            sum += sample;
          }

          if (events[i] == "Click") {
            this.clicks = sum;
          } else if (events[i] == "Open") {
            this.open = sum;
          } else if (events[i] == "Bounce") {
            this.bounce = sum;
          } else if (events[i] == "Delivery") {
            this.delivery = sum;
          } else if (events[i] == "Reject") {
            this.rejects = sum;
          } else if (events[i] == "Send") {
            this.send = sum;
            this.numEmails = sum;
          }

          this.responseData[events[i]] = sum;
        }

        this.undelivery = this.send - this.delivery;
        this.responseData["undelivered"] = this.undelivery // put No Delivery
        this.percentDelivery = this.getPercent(this.delivery);
        this.percentNODelivery = this.getPercent(this.undelivery);
        this.percentReject = this.getPercent(this.rejects);
        this.percentOpen = this.getPercent(this.open);
        this.percentClick = this.getPercent(this.clicks);
        this.percentBounce = this.getPercent(this.bounce);

        this.isProgress = false;

      }
      console.log("this.send"+this.send);
      console.log("this.undelivery"+this.undelivery);
      console.log("Response Data: " + JSON.stringify(this.responseData));
      if (this.send != 0) {
        //his.title = "Delivery"
        this.pieChartDelivery = this.dashboardService.pieChartDelivery(this.responseData);
        this.pieChartOpened = this.dashboardService.pieChartOpen(this.responseData);

      }

    });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  showAlert(message) {

    this.dialogConfig.data = {
      title: 'Emails',
      message: message
    };
    let dialogRef = this.dialog.open(AlertComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
      if (result == 'confirm') {

      }
    })
  }
}
