import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowHeaderComponent } from './chat-window-header.component';

describe('ChatWindowHeaderComponent', () => {
  let component: ChatWindowHeaderComponent;
  let fixture: ComponentFixture<ChatWindowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWindowHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatWindowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
