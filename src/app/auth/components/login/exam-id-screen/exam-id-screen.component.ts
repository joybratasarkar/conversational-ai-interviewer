import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-exam-id-screen',
  templateUrl: './exam-id-screen.component.html',
  styleUrls: ['./exam-id-screen.component.scss']
})
export class ExamIdScreenComponent implements OnInit {
  examIdInvalid: boolean =false;

  constructor(private authService:AuthService,
    private router: Router,
    private _utilityService:UtilityService,
    private fb: FormBuilder,
    private activatedRoute:ActivatedRoute
  )
  {
    this.login = this.fb.group({
      exam_id: ['', [Validators.required]] 
    });


  }
  ngOnInit(): void {
    this.login.get('exam_id')?.valueChanges.subscribe(() => {
      this.examIdInvalid = false; 
    });

    this.activatedRoute.queryParams.subscribe(params => {
      const examId = params['exam_id'];  // Get exam_id from query params
      if (examId) {
        this.login.patchValue({
          exam_id: examId  // Patch exam_id value dynamically
        });
      }
    });
  }
  login = new FormGroup({
    exam_id: new FormControl(''),
  });


  onSubmit() {
    // this.router.navigate(['/auth/ai-interview-screen'], { 
    //   queryParams: { projectId: 'MjYx' } 
    // });
    // window.location.href = '/auth/ai-interview-screen?projectId=MjYx';

    if (this.login.invalid) {
      this.examIdInvalid = true;
      return;
    }
    this.authService.examIdVerfity(this.login.value).subscribe({
      next:(res:any)=>{
        console.log('resp',res);
        this._utilityService.setAuthToken(this._utilityService.base64Encode(res?.headers.get('x-amzn-Remapped-authorization') || res.headers.get('Authorization') || ''))
        this._utilityService.setUser(JSON.stringify(res?.body?.data));   
        // this.router.navigate(['/auth/ai-interview-screen']);
        this.router.navigate([''],
           {  queryParams: { projectId: this._utilityService.base64Encode(res?.body?.data?.job_id) } }
          );  
      },
      error:(err:any)=>{
       
        if(err?.error?.message == 'Wrong Exam Id entered, Please Check'){
          this.examIdInvalid = true
          return

        }
      }
    })
  }
}
