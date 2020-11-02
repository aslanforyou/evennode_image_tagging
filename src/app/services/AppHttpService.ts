import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Board} from '../interfaces/Board';
import {Image} from '../interfaces/Image';

@Injectable({
  providedIn: 'root',
})
export class AppHttpService {

  constructor(private http: HttpClient) {
  }

  getBoards() {
    return this.http.get(environment.urls.boards);
  }

  createBoard(name: string) {
    return this.http.post(environment.urls.boards, {name});
  }

  saveBoard(board: Board) {
    return this.http.put(environment.urls.boards, {board});
  }

  runTagging(images: Image[]) {
    return this.http.post(environment.urls.tags, {images});
  }

}
