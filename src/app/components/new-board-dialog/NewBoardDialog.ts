import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-board-dialog',
  templateUrl: 'new-board-dialog.html',
})
export class NewBoardDialogComponent {
  boardName = '';

  constructor(
    public dialogRef: MatDialogRef<NewBoardDialogComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
