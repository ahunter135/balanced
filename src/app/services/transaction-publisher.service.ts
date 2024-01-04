import { Injectable } from '@angular/core';
import { ITransactionPublisher, ITransactionSubscriber, TransactionEvent } from './interfaces/transaction-publisher';

/** This service is responsible for notifying subscribed classes of transaction events.
  * This will allow any page, component, or service to maintain their own local copy
  * of the transactions and update them when the database changes.
  * Classes that wish to subscribe should implement the ITransactionSubscriber interface.
  * The class should then handle the event in the onTransactionEvent method by responding
  * to the three types of arrays in the event object.
  */

@Injectable({
  providedIn: 'root'
})
export class TransactionPublisherService implements ITransactionPublisher {

  private subscribers: Set<ITransactionSubscriber> = new Set<ITransactionSubscriber>();

  constructor() { }

  publishEvent(event: TransactionEvent): void {
    console.log('Publishing event', event);
    this.subscribers.forEach((subscriber) => {
      subscriber.onTransactionEvent(event);
    });
  }

  subscribe(subscriber: ITransactionSubscriber): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: ITransactionSubscriber): void {
    this.subscribers.delete(subscriber);
  }
}
