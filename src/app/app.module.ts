import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';


import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';






import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { AboutComponent } from './about/about.component';

import { DictionaryService } from './dictionary.service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import { SearchComponent } from './search/search.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    AboutComponent,
    SearchComponent,
    SearchbarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    timeOut: 10000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    }),
    RouterModule.forRoot([
      { path: 'about', component: AboutComponent},
      { path: 'definition/:id', component: DetailComponent},
      { path: 'search', component: SearchComponent},
      { path: '', redirectTo: '/search', pathMatch: 'full'},
      { path: '**', component: SearchComponent}
    ])
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [DictionaryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

