import {Component, OnInit} from '@angular/core';
import {Board} from './interfaces/Board';
import {MatDialog, MatSnackBar} from '@angular/material';
import {NewBoardDialogComponent} from './components/new-board-dialog/NewBoardDialog';
import {AppHttpService} from './services/AppHttpService';
import {HttpError} from './interfaces/HttpError';
import {Image} from './interfaces/Image';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Photo Board';

  imageUrl = '';

  boards: Board[];
  selectedBoard: Board;
  imageArray: Image[];
  newTags = false;

  constructor(public dialog: MatDialog, private http: AppHttpService, private snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.reloadBoards();
    console.log('DEBUGG ngOnInit ');
  }

  hasImagesToDisplay(): boolean {
    return this.imageArray && this.imageArray.length > 0;
  }

  imagesToTagCount(): number {
    if (!this.imageArray) {
      return 0;
    }
    return this.imageArray.filter(image => !image.tags || image.tags.length === 0).length;
  }

  imagesToSave(): boolean {
    const newImages = this.imageArray && this.imageArray.length > this.selectedBoard.images.length;
    return newImages || this.newTags;
  }

  addImageToBoard(): void {
    if (!this.imageUrl || this.imageUrl.trim().length === 0) {
      return;
    }
    this.imageArray.push({url: this.imageUrl, isNew: true});
    this.imageUrl = '';
  }

  createBoardDialog(): void {
    const dialogRef = this.dialog.open(NewBoardDialogComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.http.createBoard(name).subscribe((newBoard: Board) => {
          this.boards.push(newBoard);
          if (this.boards.length === 1) {
            this.selectedBoard = this.boards[0];
            this.dismissChanges();
          }
          this.showToast('Created!', 2500);
        }, (error: HttpError) => {
          this.showToast('Cannot create Board');
        });
      }
    });
  }

  selectBoard(boardId) {
    console.log('DEBUGG boardId ', boardId);
    this.selectedBoard = this.boards.find(board => board._id === boardId);
    this.dismissChanges();
  }

  reloadBoards(): void {
    this.http.getBoards().subscribe((boards: Board[]) => {
      this.boards = boards;
      if (!this.selectedBoard) {
        this.selectedBoard = this.boards[0];
      }

      this.selectedBoard.images = boards.find(board => board._id === this.selectedBoard._id).images;
      this.dismissChanges();
    }, (error: HttpError) => {
      this.showToast(error.err);
    });
  }

  dismissChanges(): void {
    if (this.selectedBoard) {
      [...this.imageArray] = this.selectedBoard.images;
      this.newTags = false;
    }
  }

  saveBoard(): void {
    const ghostBoard = Object.assign({}, this.selectedBoard);
    ghostBoard.images = this.imageArray.filter(image => image.isNew);
    this.http.saveBoard(ghostBoard).subscribe((response: Image[]) => {
      this.selectedBoard.images = response;
      this.newTags = false;
      this.reloadBoards();
      this.showToast('Saved');
    }, (error: HttpError) => {
      this.showToast(error.err || 'Cannot save board');
    });
  }

  runTagging(): void {
    this.showToast('Searching tags', 5000);
    const images = this.imageArray.filter(image => !image.tags || image.tags.length === 0);
    this.http.runTagging(images).subscribe((response: Image[]) => {
      response.forEach(item => item.isNew = true);
      this.imageArray = this.imageArray.filter(image => image.tags && image.tags.length !== 0);
      this.imageArray = this.imageArray.concat(response);
      this.newTags = true;
      this.snack.dismiss();
    },
    (error: HttpError) => {
      this.snack.dismiss();
      this.showToast(error.err || 'Cannot get Tags');
    });
  }

  showToast(msg: string, duration = 1500) {
    this.snack.open(msg, '', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
