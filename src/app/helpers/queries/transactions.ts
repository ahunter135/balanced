import { Query, and, query, where } from 'firebase/firestore';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';

export function buildTransactionsQuery(
  userId: string,
  includePending: boolean,
  startDate: Date | null,
  endDate: Date | null,
  category: string | null = null,
): Query {
  let wheres: any[] = [];
  if (!includePending) {
    wheres.push(where('pending', '==', false));
  }
  if (startDate) {
    wheres.push(where('date', '>=', startDate));
  }
  if (endDate) {
    wheres.push(where('date', '<=', endDate));
  }
  if (category) {
    wheres.push(where('subcategoryId', '==', category));
  }
  return query(
    TransactionsRepositoryService.makeCollectionRef(userId),
    and(
      ...wheres
    )
  );
}
