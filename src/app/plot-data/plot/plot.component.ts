import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DataSeries, DataSeriesType, DataService } from 'src/app/service/data.service';
import * as Chart from 'chart.js';
import { Util } from 'src/app/util/util';
import { saveAs } from 'file-saver';
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js";

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
  // what colots will be different ranges of points if we color them specifically
  pointsColors: string[]
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

  chartFontSettings: {
    titleFontSize: number,
    xLabelFontSize: number,
    yLabelFontSize: number,
    xTickFontSize: number,
    yTickFontSize: number,
    legendFontSize: number
  }

  colors: { back: string, line: string }[]
  advancedColorSettings: boolean
// user input for ranges of different colors for points on the graph
  xPointsColors: any[]
  yPointsColors: any[]

  chartTypes: { id: string, label: string }[]
  chartType: string //current chart type
  selectedChartType: string

  // for violin and boxplot
  violinSettings: {
    showPoints: boolean
    itemRadius: number
    outlierColor: string
  }
  


  constructor(public el: ElementRef, public dataService: DataService) {
    this.backgroundColors = ["#52D1DC", "#BD9391", "#F9A03F", "#F8DDA4", "#DDF9C1"]
    this.borderColor = ["#2ABECB", "#AB7673", "#F88812", "#F5CE7A", "#C2F490"]
    this.pointsColors = ['#000fff', '#ff0000','#00ff24','#edff00','#00ebff','#ffae00','#00a117','#ff00fc']
    this.chartTypes = [{ id: "bar", label: "Bar" },
    { id: "line", label: "Line" },
    { id: "radar", label: "Radar" },
    { id: 'pie', label: 'Pie' },
    { id: 'doughnut', label: 'Doughnut' },
    { id: 'violin', label: 'Violin' },
    { id: 'boxplot', label: 'Boxplot'}
      // { id: 'horizontalBar', label: "Horizontal Bar" } // need to fix axes update
    ]
    this.colors = []
    this.xPointsColors = []
    this.yPointsColors = []
    this.advancedColorSettings = false
    this.violinSettings= {
      showPoints: false,
      itemRadius: 3,
      outlierColor: '#aaaaaa'
    }
    this.chartFontSettings = {
      titleFontSize: 12,
      xLabelFontSize: 12,
      yLabelFontSize: 12,
      xTickFontSize: 12,
      yTickFontSize: 12,
      legendFontSize: 12
    }
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
      if (chartType == 'scatter' || chartType == 'line' || chartType == 'radar') {
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
        backgroundColor: this.getColorFunction(backColor, this.xPointsColors, this.yPointsColors, this),
        borderColor: this.getColorFunction(borderColor, this.xPointsColors, this.yPointsColors, this),
        showLine: true,
        fill: true
      })
      
      this.colors.push({ back: backColor, line: borderColor })
    }
    while(this.xPointsColors.length < datasets.length){
      this.xPointsColors.push([]);
      this.yPointsColors.push([]);
    }

    chartData = { datasets: datasets }
    if (labels) {
      chartData.labels = labels
    }
    // violin works differently, maybe later make it more convenient
    if (chartType == 'violin' || chartType == 'boxplot') {
      chartData.labels = ['']
      for (var i = 0; i < chartData.datasets.length; i++) {
        chartData.datasets[i].data = [chartData.datasets[i].data]
      }

    }

    this.drawChartFromScratch({
      type: chartType,
      data: chartData,
      options: chartOptions
    }, chartType);
  }

  drawChartFromScratch(config, chartType = 'bar') {
    if (this.chart) {
      this.chart.destroy()
    }
    this.chartType = chartType
    this.chart = new Chart(this.canvas.nativeElement, config);
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

  updateViolinBoxplot(){
    console.log("update boxplot")
    var datasets = this.chart.data.datasets
    for (var i=0; i<datasets.length;i++){
      // @ts-ignore
      datasets[i].itemRadius = this.violinSettings.showPoints? this.violinSettings.itemRadius: 0;
      // @ts-ignore
      datasets[i].outlierColor = this.violinSettings.outlierColor;
    }
    this.chart.update();
  }

  updateColors() {
    var datasets = this.chart.data.datasets
    for (let i = 0; i < this.colors.length; i++) {
      const color = this.colors[i];
      // @ts-ignore
      datasets[i].backgroundColor = this.getColorFunction(color.back, this.xPointsColors, this.yPointsColors, this)
      // @ts-ignore
      datasets[i].borderColor = this.getColorFunction(color.line, this.xPointsColors, this.yPointsColors, this)
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
    if (!scales) {
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
      scales.xAxes[0].ticks.callback = (tick) => {
        return tick.toString() + this.xUnitsInput
      }
    }
    if (this.yUnitsInput) {
      scales.yAxes[0].ticks.callback = (tick) => {
        return tick.toString() + this.yUnitsInput
      }
    }
    if (this.chartFontSettings.titleFontSize){
      this.chart.config.options.title.fontSize = this.chartFontSettings.titleFontSize;
    }
    if (this.chartFontSettings.xLabelFontSize){
      scales.xAxes[0].scaleLabel.fontSize = this.chartFontSettings.xLabelFontSize
    }
    if (this.chartFontSettings.yLabelFontSize){
      scales.yAxes[0].scaleLabel.fontSize = this.chartFontSettings.yLabelFontSize
      
    }
    if (this.chartFontSettings.xTickFontSize){
      scales.xAxes[0].ticks.fontSize = this.chartFontSettings.xTickFontSize
    }
    if (this.chartFontSettings.yTickFontSize){
      scales.yAxes[0].ticks.fontSize = this.chartFontSettings.yTickFontSize
    }
    if (this.chartFontSettings.legendFontSize){
      this.chart.config.options.legend.labels.fontSize = this.chartFontSettings.legendFontSize
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
  labelsKeysArray(dataSeries: DataSeries) {
    return Array.from(dataSeries.labelsX.keys())
  }


  changeShowLine(event) {
    var id = event.target.value
    var checked = event.target.checked
    //  doesn't work with just update
    var d = this.chart.data.datasets[id]
    d.showLine = checked
    d.fill = checked
    this.drawChartFromScratch({
      type: this.chartType,
      data: this.chart.data,
      options: this.chart.config.options
    }, this.chartType);
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

  /**
   * Returns the function to color points on the graph according to user specified ranges
   * @param defaultColor default line/back color
   * @param xPointsColor  ranges for x axis highlight
   * @param yPointsColor  ranges for y axis highlight
   * @param component the component, just because we use one function from it
   */
  getColorFunction(defaultColor, xPointsColor, yPointsColor, component) {
    return function (context) {
      var type = context.chart.config.type;
      var setIndex = context.datasetIndex;
      var index = context.dataIndex;
      var value = context.dataset.data[index];
      console.log(value);
      if (!value) {
        return defaultColor;
      }
      if (type == 'scatter') {
        var col = component.getColorForValue(value.x, xPointsColor[setIndex])
        if (col != null){
          return col
        }
        col = component.getColorForValue(value.y, yPointsColor[setIndex]);
        if (col != null){
          return col
        }
      }
      if (type == 'bar' || type == 'line'){
        var col = component.getColorForValue(value, xPointsColor[setIndex])
        if (col != null){
          return col
        }
      }
      return defaultColor;
    }
  }

  addXpointColor(i){
    this.xPointsColors[i].push({start:0, stop:0, color:this.pointsColors[this.xPointsColors[i].length%this.pointsColors.length]});
  }

  addYpointColor(i){
    this.yPointsColors[i].push({start:0, stop:0, color:this.pointsColors[this.yPointsColors[i].length%this.pointsColors.length]});
  }

  // for the value determines if it belongs to any range and return color for it
  getColorForValue(value, ranges){
    for(var i=0; i<ranges.length;i++){
      var range = ranges[i];
      if (value >= range.start && value <= range.stop){
        return range.color;
      }
    }
    return null;
  }
}
