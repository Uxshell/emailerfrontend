import { Component, OnInit, Input, Directive, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit {
  message: string;
  title: string; 

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.message = data.message;
    this.title = data.title;
   }


  ngOnInit(): void {

  }

}
