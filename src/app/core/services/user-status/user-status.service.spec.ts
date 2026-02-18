/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserStatusService } from './user-status.service';

describe('Service: UserStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStatusService]
    });
  });

  it('should ...', inject([UserStatusService], (service: UserStatusService) => {
    expect(service).toBeTruthy();
  }));
});
