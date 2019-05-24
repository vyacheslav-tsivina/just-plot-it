import { Component } from '@angular/core';
import { DataService, DataSeries } from '../service/data.service';

@Component({
  selector: 'data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {
  series: DataSeries[]
  active_input
  active_span
  active_div
  active_series

  constructor(private dataService: DataService) {
    this.series = dataService.series
  }

  eraseAll() {
    this.dataService.series = []
    this.series = this.dataService.series
  }

  editName(span, series_div, input, series) {
    series_div.hidden = true
    if (this.active_input) {
      this.active_input.hidden = true
      this.active_div.hidden = false
      this.active_series.name = this.active_input.value
    }
    this.active_div = series_div
    this.active_span = span
    this.active_input = input
    this.active_series = series
    input.hidden = false
    input.value = span.innerText
  }

  onInputKeydown(event) {
    if (event.key === "Enter") {
      this.active_input.hidden = true
      this.active_div.hidden = false
      this.active_series.name = this.active_input.value
      this.active_input = undefined
      this.active_span = undefined
      this.active_series = undefined
    }
  }

  defineType(series: DataSeries) {
    if (series.x) {
      return "x,y"
    }
    if (series.labelsX) {
      return "categories"
    }
    return "values"
  }
}