import { Query, and, query, where } from 'firebase/firestore';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
import { NumberMonthYear } from 'src/app/types/dates/dates';

export function buildSubcategoryByDateQuery(userId: string, categoryId: string, date: NumberMonthYear): Query {
  return query(
    SubcategoryRepositoryService.makeCollectionRef(userId, categoryId),
    and(
      where('date.month', '==', date.month),
      where('date.year', '==', date.year)
    )
  );
}
