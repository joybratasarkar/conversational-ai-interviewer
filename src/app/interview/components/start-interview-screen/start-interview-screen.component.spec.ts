import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartInterviewScreenComponent } from './start-interview-screen.component';

describe('StartInterviewScreenComponent', () => {
  let component: StartInterviewScreenComponent;
  let fixture: ComponentFixture<StartInterviewScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartInterviewScreenComponent]
    });
    fixture = TestBed.createComponent(StartInterviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
