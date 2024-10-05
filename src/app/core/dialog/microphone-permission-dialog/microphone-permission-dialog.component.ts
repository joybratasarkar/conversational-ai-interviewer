import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-microphone-permission-dialog',
  templateUrl: './microphone-permission-dialog.component.html',
  styleUrls: ['./microphone-permission-dialog.component.scss']
})
export class MicrophonePermissionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MicrophonePermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
