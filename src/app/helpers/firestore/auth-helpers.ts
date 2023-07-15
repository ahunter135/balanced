import { Category } from 'src/app/types/firestore/user';
import { v4 as uuid } from 'uuid';

export function getDefaultCategories(): Array<Category> {
  let result: Array<Category> = [];
  const namesAndEditables = getDefaultCategoryNamesAndEdit();
  for (let i = 0; i < namesAndEditables.length; i++) {
    const [name, editable] = namesAndEditables[i];
    result[i] = {
      text: name,
      index: i,
      id: uuid(),
      editable: editable,
    };
  }
  return result;
}

export function getDefaultCategoryNamesAndEdit(): Array<[string, boolean]> {
  let result: Array<[string, boolean]> = [];
  result[0] = ['income', false];
  result[1] = ['housing', true];
  result[2] = ['giving', true];
  result[3] = ['savings', true];
  result[4] = ['transportation', true];
  result[5] = ['food', true];
  result[6] = ['lifestyle', true];
  result[7] = ['insurance', true];
  result[8] = ['debt', true];
  return result;
}
