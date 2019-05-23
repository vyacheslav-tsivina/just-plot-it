import { Component, OnInit, Input } from '@angular/core';
import { DataSeries } from 'src/app/service/data.service';

@Component({
  selector: 'plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnInit {
  @Input("dataSeries")
  dataSeries : DataSeries
  public barChartOptions
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData

  constructor() { 
    
  }

  ngOnInit() {
    this.barChartOptions = {
      scaleShowVerticalLines: true,
      responsive: true,
    };
    var data = []
    
    
    if (this.dataSeries.x){
      this.barChartType = 'scatter'
      data = this.xyData()
      this.barChartOptions.showLine  = true

    }
    if (this.dataSeries.labelsX){
      data = this.dataSeries.y
      this.barChartLabels = this.dataSeries.labelsX
    }
    if (!this.dataSeries.labelsX && !this.dataSeries.x){
      data = this.dataSeries.y
      this.barChartLabels = Array.from({length: this.dataSeries.y.length}, (v, k) => (k+1).toString())
    }
    this.barChartData = [
      { data: data, label: this.dataSeries.name, backgroundColor: "rgba(255,221,50,0.2)",borderColor: "rgba(255,221,50,1)", showLine: true}
    ]
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
