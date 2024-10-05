import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQsScreenComponent } from './faqs-screen.component';

describe('FAQsScreenComponent', () => {
  let component: FAQsScreenComponent;
  let fixture: ComponentFixture<FAQsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FAQsScreenComponent]
    });
    fixture = TestBed.createComponent(FAQsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
