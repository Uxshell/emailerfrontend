import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from '../_alerts/alert/alert.component';
import { User } from '../_models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  email: string;
  password: string;
  users: any = [];
  response = {};
  request = {};
  token = null;
  user: User;


  constructor(public rest: RestService, private router: Router, private dialog: MatDialog) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser'))); 
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = this.currentUserSubject.value;

    this.rest.getUsers().subscribe((data)=>{
      var users = data.data;
      console.log("data users: " + JSON.stringify(users));
      if (Object.keys(users).length === 0) {
        this.rest.createAdmin().subscribe((admin)=>{
          console.log("data admin: " + JSON.stringify(admin));
          
        });
      }
    });

    // redirect to home if already logged in
    if (this.user) {
      this.router.navigate(['/']);
    }

    


  }


  ngOnInit() {
  }


  login(): void {
    this.response = {};
    this.request = {
      email: this.email,
      password: this.password
    }

    this.rest.login(this.request).subscribe((data) => {
      //console.log("data..." + JSON.stringify(data));
      if (data.response.success) {
        this.token = data.response.token;
        this.user = data.response.user;
        this.user.token = this.token;
        this.user.rol = data.response.user.rol;
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.router.navigate(["/"]);
      }
      else {
        const dialogConfig = new MatDialogConfig();
        let message = data.response.err.message;

        dialogConfig.data = {
          title: 'Login',
          message: message
        };

        let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
          if (result == 'confirm') {
            //console.log('Unregistered');
          }
        })
      }
      //this.users = data;
    });
  }


}
