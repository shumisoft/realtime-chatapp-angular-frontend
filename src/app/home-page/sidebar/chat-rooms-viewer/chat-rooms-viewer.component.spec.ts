import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomsViewerComponent } from './chat-rooms-viewer.component';

describe('ChatRoomsViewerComponent', () => {
  let component: ChatRoomsViewerComponent;
  let fixture: ComponentFixture<ChatRoomsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatRoomsViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRoomsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
