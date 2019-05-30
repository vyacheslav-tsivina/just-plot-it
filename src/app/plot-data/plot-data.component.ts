import { Component } from '@angular/core';
import { DataService, DataSeries } from '../service/data.service';

@Component({
  selector: 'plot-data',
  templateUrl: './plot-data.component.html',
  styleUrls: ['./plot-data.component.css']
})
export class PlotDataComponent {
  series: DataSeries[]

  
  constructor(public dataService: DataService) {

  }

}