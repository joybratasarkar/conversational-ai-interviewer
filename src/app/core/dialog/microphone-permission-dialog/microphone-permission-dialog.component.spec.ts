import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrophonePermissionDialogComponent } from './microphone-permission-dialog.component';

describe('MicrophonePermissionDialogComponent', () => {
  let component: MicrophonePermissionDialogComponent;
  let fixture: ComponentFixture<MicrophonePermissionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MicrophonePermissionDialogComponent]
    });
    fixture = TestBed.createComponent(MicrophonePermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
