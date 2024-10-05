import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewLayoutComponent } from './interview-layout.component';

describe('InterviewLayoutComponent', () => {
  let component: InterviewLayoutComponent;
  let fixture: ComponentFixture<InterviewLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewLayoutComponent]
    });
    fixture = TestBed.createComponent(InterviewLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
