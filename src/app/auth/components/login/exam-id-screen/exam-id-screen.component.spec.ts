import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamIdScreenComponent } from './exam-id-screen.component';

describe('ExamIdScreenComponent', () => {
  let component: ExamIdScreenComponent;
  let fixture: ComponentFixture<ExamIdScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamIdScreenComponent]
    });
    fixture = TestBed.createComponent(ExamIdScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
