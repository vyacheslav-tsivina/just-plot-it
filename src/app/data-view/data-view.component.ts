import { Component, ViewChildren, QueryList } from '@angular/core';
import { DataService, DataSeries } from '../service/data.service';
import { Util } from '../util/util';

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

  selected_series: DataSeries[]
  @ViewChildren("checkbox") checkboxes: QueryList<any>

  constructor(private dataService: DataService) {
    this.series = dataService.series
    this.selected_series = []
  }

  eraseAll() {
    this.dataService.series = []
    this.series = this.dataService.series
    this.dataService.series_id_counter = 0
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


  /**
   * Checks if checked series compatible with previsosly selected series
   * @param event checkbox click event
   */
  checkValue(event) {
    console.log(this.selected_series)
    var checkbox = event.target
    // don't let different types in one figure
    if (checkbox.checked && this.selected_series.length > 0 && this.selected_series[0].type != this.series[checkbox.value].type) {
      checkbox.checked = false
      return
    }
    if (!checkbox.checked) {
      Util.removeIf(this.selected_series, s => s.id == checkbox.value)
      return
    }
    this.selected_series.push(this.series[checkbox.value])
  }

  clearSelected() {
    this.checkboxes.forEach(e => e.nativeElement.checked = false)
    this.selected_series = []
  }

  /**
   * Creates a figure based on selectred series
   */
  createFigure() {
      if (this.selected_series.length == 0){
        return
      }
      this.dataService.figures.push(this.selected_series)
      this.clearSelected()
  }
}