import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiInterviewScreenComponent } from './ai-interview-screen.component';

describe('AiInterviewScreenComponent', () => {
  let component: AiInterviewScreenComponent;
  let fixture: ComponentFixture<AiInterviewScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiInterviewScreenComponent]
    });
    fixture = TestBed.createComponent(AiInterviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
