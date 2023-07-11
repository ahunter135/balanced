import { Subcategory } from './subcategory';

export interface Category {
  text: string;
  index: number;
  subcategories: Array<Subcategory>;
  id: string;
}
