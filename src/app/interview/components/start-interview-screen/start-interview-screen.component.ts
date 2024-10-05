import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { InterviewService } from 'src/app/core/services/interview.service';

@Component({
  selector: 'app-start-interview-screen',
  templateUrl: './start-interview-screen.component.html',
  styleUrls: ['./start-interview-screen.component.scss']
})
export class StartInterviewScreenComponent implements OnInit,OnDestroy{
  id: any
  projectId: any
  engineer_id: any;
  engineer_name!:string
  interview_questions!:number
constructor(
  private service: InterviewService,
  private toastr: ToastrService,
  private activatedRoute: ActivatedRoute,
  private route: Router,

)
{

}
  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this._unsubscribe$)).subscribe(params => {
      this.id = params['id'];
      this.projectId = params['projectId'];
      this.engineer_id = params['engineer_id']
      
  
      this.usersAiInterviewer()
    });

  }

private _unsubscribe$ = new Subject<boolean>();



  startConversation() {


    this.service.createInterview(this.id).pipe(takeUntil(this._unsubscribe$)).subscribe({
      next: (resp: any) => {

        localStorage.setItem('interviewInProgress', JSON.stringify(true));
        this.route.navigate(['introduction-screen', 'ai-interview-screen'], { queryParams: { id: this.id, projectId: this.projectId, engineer_id: this.engineer_id } })
        localStorage.setItem('total_questions', resp?.data?.interview_conversation?.total_questions);


        
       
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err?.error?.message)
      }

    })
  }


  usersAiInterviewer() {
    this.service.usersAiInterviewer(this.id).pipe(takeUntil(this._unsubscribe$)).subscribe({
      next: (resp: any) => {
        this.engineer_name=resp?.data?.interview?.engineer_name
        this.interview_questions=resp?.data?.interview?.interview_questions
        
        // this.speechToText.connectWebSocket(lastElement?.text)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);

      }
    })
  }
  ngOnDestroy(): void {
    this._unsubscribe$.next(true)
    this._unsubscribe$.complete()
  }

}
