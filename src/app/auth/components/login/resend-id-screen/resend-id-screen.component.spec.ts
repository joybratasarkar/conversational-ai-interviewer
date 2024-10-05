import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendIdScreenComponent } from './resend-id-screen.component';

describe('ResendIdScreenComponent', () => {
  let component: ResendIdScreenComponent;
  let fixture: ComponentFixture<ResendIdScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResendIdScreenComponent]
    });
    fixture = TestBed.createComponent(ResendIdScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
