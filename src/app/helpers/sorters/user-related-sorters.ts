import { Category } from "src/app/types/firestore/user";

export function defaultCategorySort(a: Category, b: Category) {
  if (a.index > b.index) {
    return 1;
  } else if (a.index < b.index) {
    return -1;
  } else {
    return 0;
  }
}
