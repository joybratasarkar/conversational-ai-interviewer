import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouScreenComponent } from './thankyou-screen.component';

describe('ThankyouScreenComponent', () => {
  let component: ThankyouScreenComponent;
  let fixture: ComponentFixture<ThankyouScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThankyouScreenComponent]
    });
    fixture = TestBed.createComponent(ThankyouScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
