import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatViewerComponent } from './chat-viewer.component';

describe('ChatViewerComponent', () => {
  let component: ChatViewerComponent;
  let fixture: ComponentFixture<ChatViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
