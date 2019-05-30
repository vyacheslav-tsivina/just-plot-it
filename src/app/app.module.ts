import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataLoaderModule } from './data-loader/data-loader.module';
import { DataService } from './service/data.service';
import { DataViewModule } from './data-view/data-view.module';
import { PlotDataModule } from './plot-data/plot-data.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FaqComponent } from './faq/faq.component';
import { Routes, RouterModule } from '@angular/router';
import { MainGraphComponent } from './main-graph-view/main-graph-view.component';


const appRoutes: Routes = [
  { path: '', component: MainGraphComponent },
  { path: 'faq', component: FaqComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MainGraphComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataLoaderModule,
    DataViewModule,
    PlotDataModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
