import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css']
})
export class AutomationComponent implements OnInit {

  constructor() { }
  typesOfShoes: string[] = ['Lista de socios Banorte XXI', 'Other list', 'Other list 2', 'Other list 3', 'Other list 4'];
  ngOnInit(): void {

  }
  
  
  

}
