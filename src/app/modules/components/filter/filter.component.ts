import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input('options')
  options = [];

  optiontext = new FormControl();
  optionSimbols = new FormControl();
  

  @Input('filtersHeaders')
  filtersHeaders;

  @Input('index')
  index;

  @Input('filterHeader')
  filterHeader;

  @Input('type')
  type;



  constructor() {


  }

  ngOnInit(): void {


  }

  removeInput(index){
    this.filtersHeaders.splice(index, 1)

  }

  
  
}
