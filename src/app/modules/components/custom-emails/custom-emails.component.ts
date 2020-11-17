import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../rest.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-emails',
  templateUrl: './custom-emails.component.html',
  styleUrls: ['./custom-emails.component.css']
})
export class CustomEmailsComponent implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;

  response = {};
  request = {};
  isCompleted: boolean;
  isFinish: boolean;
  isError: boolean;
  totalEmails: number;

  constructor(private router: Router, public rest: RestService) {
    
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    // redirect to home if already logged in
    this.user = this.currentUserSubject.value;

    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol == 'viewer') {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.user = this.currentUserSubject.value;

    if (this.user === null) {
      this.router.navigate(['login']);
    }
    this.isCompleted = false;
    this.isFinish = false;
    this.isError = false;
  }

  
  sendEmails(): void {
    //console.log("sendind emails...");
    this.isCompleted = true;
  
    this.rest.activeLambdaEmailer().subscribe((data) => {
      //let res = JSON.parse(data);
      //console.log("-- data -- " + JSON.stringify(data));
      this.isCompleted = false;
      if (data.response.statusCode === 200) {
        this.isFinish = true;
        this.totalEmails = data.response.totalEmails;
      }
      else {
        this.isError = true;
        console.error("error: " + JSON.stringify(data))
      }
    });
  }
}
