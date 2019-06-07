import { Component } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'data-loader',
  templateUrl: './data-loader.component.html',
  styleUrls: ['./data-loader.component.css']
})
export class DataLoaderComponent {

  input_text: string
  delimiter: string
  errorMessage: string

  constructor(private dataService: DataService) {
    this.delimiter = ","
  }

  loadData(): void {
    var error = this.dataService.parseInputIntoSeries(this.input_text, this.delimiter)
    if (error.length > 0) {
      this.errorMessage = error
    } else {
      this.errorMessage = undefined
    }
  }

  dummyData(){
    this.input_text = `350,200,150.6,70,90,40,20,-10,17,50,90,23.24
-10,-5.6,0,5,10,15,20,24.314,29,35,42,47

140,145,160,200,170,110,20,25,54,35
-10,-5,0,8,15,20,25,30,40,47

17,14.3,12,4,8,8,15
Monday,Tuesday,Wednesday,Thursdau,Friday,Saturday,Sunday

15,14.9,11,6,9,8.5,17
Monday,Tuesday,Wednesday,Thursdau,Friday,Saturday,Sunday

3.14,14.3,12,4,8.14,2.71,15`
  }

  clearInput() {
    this.input_text = ""
  }
}