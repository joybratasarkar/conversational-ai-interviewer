import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-contact-us-screen',
  templateUrl: './contact-us-screen.component.html',
  styleUrls: ['./contact-us-screen.component.scss']
})
export class ContactUsScreenComponent {
  contactUsForm: FormGroup;
  emailIdInvalid: boolean =false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService :AuthService,
    private router : Router

  ) {
    this.contactUsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email ,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      issue: ['', [Validators.required]] 
    });
  }

  ngOnInit(): void {
    this.emailIdInvalid =false
  }
  

  get issueInvalid() {
    return this.contactUsForm.get('issue')?.invalid && (this.contactUsForm.get('issue')?.touched || this.contactUsForm.get('issue')?.dirty);
  }

  


  onSubmit(): void {
    this.contactUsForm.markAsTouched();
    if (this.contactUsForm.invalid) {
      this.emailIdInvalid = true;
      return;
    }
    if (this.contactUsForm.valid) {
      this.authService.reportIssue(this.contactUsForm.value).subscribe({
        next :(res :any)=>{
          if(res?.statusCode === 200){
            this.toastr.success(res.message, 'Success');
          }
          this.router.navigate(['/auth/login'])
          
        },
        error :(err : any)=>{
          this.toastr.success(err?.error?.message, 'Failed');
          this.emailIdInvalid = true
        }
})
    

   
  }
}
}

