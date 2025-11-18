import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowInputAreaComponent } from './chat-window-input-area.component';

describe('ChatWindowInputAreaComponent', () => {
  let component: ChatWindowInputAreaComponent;
  let fixture: ComponentFixture<ChatWindowInputAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWindowInputAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatWindowInputAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
