import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeViewControllerComponent } from './home-view-controller.component';

describe('HomeViewControllerComponent', () => {
  let component: HomeViewControllerComponent;
  let fixture: ComponentFixture<HomeViewControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeViewControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeViewControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
