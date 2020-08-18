import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-card-graph',
  templateUrl: './card-graph.component.html',
  styleUrls: ['./card-graph.component.css']
})
export class CardGraphComponent implements OnInit {

  @Input() label: string;
  @Input() total: string;
  @Input() percentage: number;

  constructor() { }

  ngOnInit() {
    
  }

}
