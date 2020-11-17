import { Component, OnInit } from '@angular/core';
import { DataService } from '../stadistics/DataService';
import { RestService } from 'src/app/rest.service';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboardServices';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/_alerts/alert/alert.component';

@Component({
  selector: 'app-custom-statistics',
  templateUrl: './custom-statistics.component.html',
  styleUrls: ['./custom-statistics.component.css']
})
export class CustomStatisticsComponent implements OnInit {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  data = [];
  pieChartOpened = [];

  cards = [];
  numEmails
  valueGlobal;

  isProgress:Boolean = false;

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

  percentDelivery = 0;
  percentReject = 0;
  percentBounce = 0;
  percentNODelivery = 0.0;

  date = new FormControl(new Date());
  initDate = null;
  finalDate = null;
  maxDate = new Date();
  minDate;
  responseData = {};
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dialogConfig = new MatDialogConfig();


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
    return (value / this.emailTotal) * 100;
  }

  updateDOB(dateObject) {
    // convert object to string then trim it to yyyy-mm-dd
    const stringified = JSON.stringify(dateObject.value);
    const dob = stringified.substring(1, 11);

    this.initDate = dob;
    var splitted = dob.split("-", 3);
    var y: number = +splitted[2];
    y = y +1;
    let dateForm = "" + splitted[0] +"-"+ splitted[1] +"-"+ y;
    this.minDate = new Date(dateForm)

    //console.log("initDate: " + this.initDate);
  }

  formDate(event) {
    const stringified = JSON.stringify(event.value);
    const dob = stringified.substring(1, 11);

    this.finalDate = dob;
    //console.log("finalDate: " + this.finalDate);
  }

  doSearch() {
    this.isProgress=true;
    let request = {
      "startTime": this.initDate + " 00:00:00",
      "endTime": this.finalDate + " 23:59:59",
      "metricName": "emailerCustomMetrics"
    }

    
    this.rest.getAllStatistics(request).subscribe((data) => {

      let body = JSON.parse(data.response);
      let newBody = JSON.parse(JSON.stringify(body));
      if (newBody["body"]["error"]) {
        console.log("hay error");
        this.isProgress = false;
        this.showAlert("Error de conexión. Intentarlo más tarde");

      }
      else {
        //console.log("hay datos");
        let events = ["Bounce", "Delivery", "Reject", "Send"]


        for (let i = 0; i < events.length; i++) {
          let sum = 0;
          let obj = newBody.body[events[i]];
          let dataPoints = obj.Datapoints;
          for (let x = 0; x < dataPoints.length; x++) {
            let sample = dataPoints[x]["SampleCount"];
            sum += sample;
          }

          if (events[i] == "Reject") {
            this.rejects = sum;
          } else if (events[i] == "Send") {
            this.send = sum;
            this.emailTotal = sum;
          } else if (events[i] == "Delivery") {
            this.delivery = sum;
          }else if (events[i] == "Bounce") {
            this.bounce = sum;
          } 

          this.responseData[events[i]] = sum;

        }

      }
      this.undelivery = this.send - this.delivery;
      this.responseData["undelivered"] = this.undelivery // put No Delivery
      this.percentNODelivery = this.getPercent(this.undelivery);
      this.percentReject = this.getPercent(this.rejects);
      this.percentDelivery = this.getPercent(this.delivery);
      this.percentBounce = this.getPercent(this.bounce);
      
      this.isProgress = false;

      //console.log("Response Data: " + JSON.stringify(this.responseData));


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
