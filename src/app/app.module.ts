import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import {NewBoardDialogComponent} from './components/new-board-dialog/NewBoardDialog';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NewBoardDialogComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  entryComponents: [NewBoardDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
