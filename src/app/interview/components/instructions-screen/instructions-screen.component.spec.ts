import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsScreenComponent } from './instructions-screen.component';

describe('InstructionsScreenComponent', () => {
  let component: InstructionsScreenComponent;
  let fixture: ComponentFixture<InstructionsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructionsScreenComponent]
    });
    fixture = TestBed.createComponent(InstructionsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
