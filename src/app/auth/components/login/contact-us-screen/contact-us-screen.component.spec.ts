import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsScreenComponent } from './contact-us-screen.component';

describe('ContactUsScreenComponent', () => {
  let component: ContactUsScreenComponent;
  let fixture: ComponentFixture<ContactUsScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsScreenComponent]
    });
    fixture = TestBed.createComponent(ContactUsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
