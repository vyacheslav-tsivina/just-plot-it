import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataLoaderComponent } from './data-loader.component';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
      DataLoaderComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbTooltipModule
  ],
  exports:[
    DataLoaderComponent
  ],
  providers: [],
  bootstrap: []
})
export class DataLoaderModule { }