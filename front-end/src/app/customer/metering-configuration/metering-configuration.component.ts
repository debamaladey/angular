import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metering-configuration',
  templateUrl: './metering-configuration.component.html',
  styleUrls: ['./metering-configuration.component.scss']
})
export class MeteringConfigurationComponent implements OnInit {
  selected = 'option1';
  
  constructor() { 
    
  }

  ngOnInit() {
  }

}
