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
      if (error.length > 0){
        this.errorMessage = error
      }
  }

  clearInput(){
    this.input_text = ""
  }
}