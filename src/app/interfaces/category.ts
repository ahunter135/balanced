export interface Category {
  text: string;
  index: number;
  subcategories: Array<Category>;
}
