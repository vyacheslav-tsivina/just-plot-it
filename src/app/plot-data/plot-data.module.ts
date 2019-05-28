import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlotDataComponent } from './plot-data.component';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PlotComponent } from './plot/plot.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    PlotDataComponent,
    PlotComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ChartsModule,
    NgbAccordionModule
  ],
  exports:[
    PlotDataComponent,
    PlotComponent
  ],
  providers: [],
  bootstrap: []
})
export class PlotDataModule { }