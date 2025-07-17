import { TestBed } from '@angular/core/testing';

import { MessageEventCommunicator } from './message-event-communicator';

describe('MessageEventCommunicator', () => {
  let service: MessageEventCommunicator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageEventCommunicator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
