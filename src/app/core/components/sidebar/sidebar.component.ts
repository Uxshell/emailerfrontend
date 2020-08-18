import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';

import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../_alerts/alert/alert.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  username: string;

  constructor(private router: Router, private dialog: MatDialog) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.user = this.currentUserSubject.value;
    if (this.user === null) {
      this.router.navigate(['login']);
    }
  }


  ngOnInit(): void {
    this.username = this.user.username;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


}
