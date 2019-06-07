import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataSeries, DataSeriesType, DataService } from 'src/app/service/data.service';
import * as Chart from 'chart.js';
import { Util } from 'src/app/util/util';
import { saveAs } from 'file-saver';

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

  backgroundColors: string[]
  borderColor: string[]
  @ViewChild("canvas")
  canvas: ElementRef


  xmin: number
  xmax: number
  ymin: number
  ymax: number

  titleInput: string
  xLabelInput: string
  yLabelInput: string
  xUnitsInput: string
  yUnitsInput: string

  colors: { back: string, line: string }[]

  chartTypes: { id: string, label: string }[]
  chartType: string //current chart type
  selectedChartType: string


  constructor(public el: ElementRef, public dataService: DataService) {
    this.backgroundColors = ["#52D1DC", "#BD9391", "#ADBABD", "#91B7C7", "#B5D8CC"]
    this.borderColor = ["#3C99A1", "#8A6B6A", "#7E888A", "#6A8691", "#849E95"]
    this.chartTypes = [{ id: "bar", label: "Bar" },
    { id: "line", label: "Line" },
    { id: "radar", label: "Radar" },
    { id: 'pie', label: 'Pie' },
    { id: 'doughnut', label: 'Doughnut' },
    // { id: 'horizontalBar', label: "Horizontal Bar" } // need to fix axes update
    ]
    this.colors = []
  }

  initChart(chartType = 'bar') {
    
    var chartOptions
    var labels
    var chartData

    chartOptions = {
      scaleShowVerticalLines: true,
      responsive: true,
    }
    var datasets = []
    this.colors = []
    for (var i = 0; i < this.dataSeries.length; i++) {
      var alpha = 1
      var data = this.getData(this.dataSeries[i])
      switch (this.dataSeries[i].type) {
        case DataSeriesType.XY: {
          chartType = 'scatter'
          
          // chartOptions.showLine = true
          break
        }
        case DataSeriesType.CATEGORIES: 
        case DataSeriesType.VALUES: {
          if (!labels || (this.dataSeries[i].y.length > labels.length)) {
            labels = this.dataSeries[i].labelsX
          }
        }
      }
      if (chartType == 'scatter' || chartType == 'line' || chartType == 'radar'){
        alpha = 0.5
      }
      var backColor
      var borderColor
      // for pie and doughnut each category should have it's own color
      if (chartType == 'pie' || chartType == 'doughnut') {
        backColor = []
        borderColor = []
        for (let j = 0; j < labels.length; j++) {
          backColor.push(Util.hexToRgbA(this.backgroundColors[j % this.backgroundColors.length], alpha))
          borderColor.push(Util.hexToRgbA(this.borderColor[j % this.borderColor.length], 1))
        }
      } else {
        backColor = Util.hexToRgbA(this.backgroundColors[i % this.backgroundColors.length], alpha)
        borderColor = Util.hexToRgbA(this.borderColor[i % this.borderColor.length], 1)
      }
      datasets.push({
        data: data,
        label: this.dataSeries[i].name,
        backgroundColor: backColor,
        borderColor: borderColor,
        showLine: true
      })
      this.colors.push({ back: backColor, line: borderColor })
    }

    chartData = { datasets: datasets }
    if (labels) {
      chartData.labels = labels
    }
    // in case we change chartType we need to redraw everything
    if (this.chart) {
      this.chart.destroy()
    }
    this.chartType = chartType
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

  updateColors() {
    var datasets = this.chart.data.datasets
    for (let i = 0; i < this.colors.length; i++) {
      const color = this.colors[i];
      datasets[i].backgroundColor = color.back
      datasets[i].borderColor = color.line
    }
    this.chart.data.datasets = datasets
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

  stackedCategories(checked) {
    for (var i = 0; i < this.chart.config.options.scales.xAxes.length; i++) {
      this.chart.config.options.scales.xAxes[i].stacked = checked
    }
    for (var i = 0; i < this.chart.config.options.scales.yAxes.length; i++) {
      this.chart.config.options.scales.yAxes[i].stacked = checked
    }
    this.chart.update()
  }


  updateLabels() {
    this.chart.config.options.title = {
      display: this.titleInput && this.titleInput.length > 0,
      text: this.titleInput
    }
    var scales = this.chart.config.options.scales
    if (!scales){
      this.chart.update()
      return
    }
    scales.xAxes[0].scaleLabel = {
      display: this.xLabelInput && this.xLabelInput.length > 0,
      labelString: this.xLabelInput
    }
    scales.yAxes[0].scaleLabel = {
      display: this.yLabelInput && this.yLabelInput.length > 0,
      labelString: this.yLabelInput
    }
    if (this.xUnitsInput) {
      scales.xAxes[0].ticks.userCallback = (tick) => {
        return tick.toString() + this.xUnitsInput
      }
    }
    if (this.yUnitsInput) {
      scales.yAxes[0].ticks.userCallback = (tick) => {
        return tick.toString() + this.yUnitsInput
      }
    }

    this.chart.update()
  }

  logarithmicScale(checked, axes) {
    if (axes == 'x') {
      this.chart.config.options.scales.xAxes[0].type = checked ? 'logarithmic' : 'linear'
    } else {
      this.chart.config.options.scales.yAxes[0].type = checked ? 'logarithmic' : 'linear'
    }
    this.chart.update()
  }

  changeChartType() {
    this.initChart(this.selectedChartType)
    console.log('change')
  }

  /**
   * Just solve some strange ANgular problem with binding by creating a new array
   */
  labelsKeysArray(dataSeries: DataSeries){
    return Array.from(dataSeries.labelsX.keys())
  }

  /**
   * @deprecated removing the line doesn't remove back
   */
  changeShowLine(event){
     var id = event.target.value
     var checked = event.target.checked
     this.chart.config.data.datasets[id].showLine = checked
     if (!checked){
       delete this.chart.data.datasets[id].borderColor
     } else{
       this.chart.config.data.datasets[id].borderColor = this.colors[id].line
     }
     this.chart.update()
  }

  export(type) {
    //create a dummy CANVAS
    var srcCanvas = this.chart.canvas
    var destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = srcCanvas.width;
    destinationCanvas.height = srcCanvas.height;

    var destCtx = destinationCanvas.getContext('2d');
    if (type == 'jpeg') {
      //create a rectangle with the desired color
      destCtx.fillStyle = "#FFFFFF";
      destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);


    }

    //draw the original canvas onto the destination canvas
    destCtx.drawImage(srcCanvas, 0, 0);
    //finally use the destinationCanvas.toDataURL() method to get the desired output;
    destinationCanvas.toDataURL();
    var url = destinationCanvas.toDataURL(type == 'jpeg' ? 'image/jpeg' : 'image/png', 1.0)
    saveAs(this.dataURItoBlob(url), "plot." + type)
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

  }
}
