import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { RoomProvider } from '../providers/room-provider';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    UiModule,
    HttpClientModule
  ],
  providers: [RoomProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
