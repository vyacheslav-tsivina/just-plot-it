import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DataSeries } from 'src/app/service/data.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit {
  @Input("dataSeries")
  dataSeries : DataSeries
  chart: Chart

  constructor(public el: ElementRef) { 
    
  }

  initChart() {
    var chartType = 'line'
    var chartOptions
    var labels
    var chartData

    chartOptions = {
      scaleShowVerticalLines: true,
      responsive: true,
    }

    var data = []
    // in case we have both x and y
    if (this.dataSeries.x){
      chartType = 'scatter'
      data = this.xyData()
      chartOptions.showLine  = true

    }
    // no x, but labelsX
    if (this.dataSeries.labelsX){
      data = this.dataSeries.y
      labels = this.dataSeries.labelsX
    }
    // onlu y, so generate labels
    if (!this.dataSeries.labelsX && !this.dataSeries.x){
      data = this.dataSeries.y
      labels = Array.from({length: this.dataSeries.y.length}, (v, k) => (k+1).toString())
    }
    
    chartData = {datasets:[
      { data: data, label: this.dataSeries.name, backgroundColor: "rgba(255,221,50,0.2)",borderColor: "rgba(255,221,50,1)", showLine: true}
    ]}
    if (labels){
      chartData.labels = labels
    }
    this.chart = new Chart(this.el.nativeElement.children[0].children[0], {
        type: chartType,
        data: chartData,
        options: chartOptions,
    });
}

  ngOnInit() {
    this.initChart()
  }

  xyData(): object[] {
    var data = []
    for (let i = 0; i < this.dataSeries.y.length; i++) {
      const y = this.dataSeries.y[i]
      var x = this.dataSeries.x[i]
      data.push({x:x, y:y})
    }
    return data
  }

}
