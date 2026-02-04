/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatMembersService } from './chat-members.service';

describe('Service: ChatMembers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatMembersService]
    });
  });

  it('should ...', inject([ChatMembersService], (service: ChatMembersService) => {
    expect(service).toBeTruthy();
  }));
});
