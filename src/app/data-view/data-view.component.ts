import { Component } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'data-view',
  templateUrl: './data-view.component.html',
  // styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {
  series
  constructor(private dataService: DataService) {
      this.series = dataService.series
  }

  eraseAll(){
    this.dataService.series = []
    this.series = this.dataService.series
  }
}