import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataLoaderModule } from './data-loader/data-loader.module';
import { DataService } from './service/data.service';
import { DataViewModule } from './data-view/data-view.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataLoaderModule,
    DataViewModule
  ],
  providers: [ DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
