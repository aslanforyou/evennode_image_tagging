import {Image} from './Image';

export interface Board {
  _id?: string;
  name: string;
  images: Image[];
}
