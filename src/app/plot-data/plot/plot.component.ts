import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataSeries, DataSeriesType, DataService } from 'src/app/service/data.service';
import * as Chart from 'chart.js';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlotComponent implements OnInit {
  @Input("dataSeries")
  dataSeries: DataSeries[]
  chart: Chart

  backgroundColours: string[]
  borderColor: string[]
  @ViewChild("canvas")
  canvas: ElementRef


  xmin: number
  xmax: number
  ymin: number
  ymax: number


  constructor(public el: ElementRef, private dataService: DataService) {
    this.backgroundColours = ["#52D1DC", "#BD9391", "#ADBABD", "#91B7C7", "#B5D8CC"]
    this.borderColor = ["#3C99A1", "#8A6B6A", "#7E888A", "#6A8691", "#849E95"]
  }

  initChart() {
    var chartType = 'bar'
    var chartOptions
    var labels
    var chartData

    chartOptions = {
      scaleShowVerticalLines: true,
      responsive: true,
    }
    var datasets = []
    for (var i = 0; i < this.dataSeries.length; i++) {
      var data = this.getData(this.dataSeries[i])
      switch (this.dataSeries[i].type) {
        case DataSeriesType.XY: {
          chartType = 'scatter'
          chartOptions.showLine = true
          break
        }
        case DataSeriesType.CATEGORIES: {
          if (!labels || (this.dataSeries[i].y.length > labels.length)) {
            labels = this.dataSeries[i].labelsX
          }
          break
        }
        case DataSeriesType.VALUES: {
          if (!labels || (this.dataSeries[i].y.length > labels.length)) {
            labels = Array.from({ length: this.dataSeries[i].y.length }, (v, k) => (k + 1).toString())
          }

        }
      }
      datasets.push({
        data: data,
        label: this.dataSeries[i].name,
        backgroundColor: this.backgroundColours[i % this.backgroundColours.length],
        borderColor: this.borderColor[i % this.borderColor.length],
        showLine: chartType == 'scatter'
      })
    }

    chartData = { datasets: datasets }
    if (labels) {
      chartData.labels = labels
    }
    // get canvas element 
    this.chart = new Chart(this.canvas.nativeElement, {
      type: chartType,
      data: chartData,
      options: chartOptions
    });


  }

  ngOnInit() {
    this.initChart()
  }

  updateAxes() {

    var scales = this.chart.config.options.scales 

    scales.xAxes[0].ticks.min = !isNaN(this.xmin) ? this.xmin : scales.xAxes[0].ticks.min
    scales.xAxes[0].ticks.max = !isNaN(this.xmax) ? this.xmax : scales.xAxes[0].ticks.max
    scales.yAxes[0].ticks.min = !isNaN(this.ymin) ? this.ymin : scales.yAxes[0].ticks.min
    scales.yAxes[0].ticks.max = !isNaN(this.ymax) ? this.ymax : scales.yAxes[0].ticks.max

    this.chart.config.options.scales = scales
    this.chart.update()
  }

  xyData(series: DataSeries): object[] {
    var data = []
    for (let i = 0; i < series.y.length; i++) {
      const y = series.y[i]
      var x = series.x[i]
      data.push({ x: x, y: y })
    }
    return data
  }

  getData(series: DataSeries) {
    var data = []
    switch (series.type) {
      case DataSeriesType.XY: return this.xyData(series)
      case DataSeriesType.CATEGORIES: return series.y
      case DataSeriesType.VALUES: return series.y
    }
  }

  deleteFigure() {
    Util.removeIf(this.dataService.figures, f => f == this.dataSeries)
  }
}
