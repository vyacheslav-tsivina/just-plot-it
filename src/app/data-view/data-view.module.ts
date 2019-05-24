import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewComponent } from './data-view.component';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'


@NgModule({
  declarations: [
    DataViewComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbTooltipModule
  ],
  exports:[
    DataViewComponent
  ],
  providers: [],
  bootstrap: []
})
export class DataViewModule { }