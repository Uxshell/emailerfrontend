import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  sideBarOpen = true;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;


  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  ngOnInit(): void {
    this.user = this.currentUserSubject.value;
    if (this.user === null) {
      this.router.navigate(['login']);
    }
  }



  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }



}
