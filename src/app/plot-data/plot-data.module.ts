import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlotDataComponent } from './plot-data.component';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { PlotComponent } from './plot/plot.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    PlotDataComponent,
    PlotComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ChartsModule,
    NgbAccordionModule,
    ColorPickerModule
  ],
  exports:[
    PlotDataComponent,
    PlotComponent
  ],
  providers: [],
  bootstrap: []
})
export class PlotDataModule { }