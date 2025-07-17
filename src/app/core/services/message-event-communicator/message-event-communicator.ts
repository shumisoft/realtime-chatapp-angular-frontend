import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageEventCommunicator {
  private eventSubject = new Subject<Message>();
  event$ = this.eventSubject.asObservable();

  emitEvent(data: Message) {
    this.eventSubject.next(data);
  }
}
