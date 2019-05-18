import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewComponent } from './data-view.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    DataViewComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports:[
    DataViewComponent
  ],
  providers: [],
  bootstrap: []
})
export class DataViewModule { }