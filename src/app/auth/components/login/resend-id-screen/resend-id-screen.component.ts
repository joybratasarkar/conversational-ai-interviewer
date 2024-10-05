import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-resend-id-screen',
  templateUrl: './resend-id-screen.component.html',
  styleUrls: ['./resend-id-screen.component.scss']
})
export class ResendIdScreenComponent {
  resendIdForm: FormGroup;
  emailIdInvalid: boolean =false;

  constructor(private fb: FormBuilder,
    private authService :AuthService,
    private toastr :ToastrService,
    private router :Router
  ) {
    this.resendIdForm = this.fb.group({
      email: ['', [Validators.required, Validators.email ,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
    });
  }

  ngOnInit(): void {
    this.emailIdInvalid =false
  }

  onSubmit(): void {
    if (this.resendIdForm.invalid) {
      this.emailIdInvalid = true;
      return;
    }
    if (this.resendIdForm.valid) {
      this.authService.reSendExamId(this.resendIdForm.value).subscribe({
        next: (response: any) => {
          if(response?.statusCode === 200){
            this.toastr.success(response.message, 'Success');
          }
          this.router.navigate(['/auth/login'])
          
        },
        error : (err:any)=>{
          console.error(err);
          this.toastr.error(err.error.message, 'Failed');
          this.emailIdInvalid =true
        }
      })
    }
  }
}

