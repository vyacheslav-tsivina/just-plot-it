import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataLoaderComponent } from './data-loader.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
      DataLoaderComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports:[
    DataLoaderComponent
  ],
  providers: [],
  bootstrap: []
})
export class DataLoaderModule { }