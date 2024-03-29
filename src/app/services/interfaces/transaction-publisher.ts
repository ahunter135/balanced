import { Transaction } from 'src/app/types/firestore/user';

/** Interface that class which publishes transaction events
 * must implement. This class should allow subscriber classes
 * to subscribe to transaction events. Some classes which
 * cause these events will notify the publisher of the event.
 */
export interface ITransactionPublisher {
  publishEvent(event: TransactionEvent): void;

  subscribe(subscriber: ITransactionSubscriber): void;
  unsubscribe(subscriber: ITransactionSubscriber): void;
}

/** Interface that class which subscribes to transaction events
 * must implement. This class should allow a transaction publisher
 * to send transaction events to the class.
 */
export interface ITransactionSubscriber {
  onTransactionEvent(event: TransactionEvent): void;
}

/** Event type that is published by the TransactionPublisher
 * and subscribed to by the TransactionSubscriber. Classes
 * that create these events will notify the publisher of
 * the event by passing this object to the publisher.
 */
export type TransactionEvent = {
  from: 'plaid' | 'manual' | 'finicity';
  addedTransactions: Transaction[];
  removedTransactions: Transaction[];
  modifiedTransactions: Transaction[];
  /** Other data that may be useful to the subscriber
   * of the event. For manual events, this should be
   * the subcategory id and the category id. For Plaid
   * events, idk yet.
   */
  other?: any;
};
