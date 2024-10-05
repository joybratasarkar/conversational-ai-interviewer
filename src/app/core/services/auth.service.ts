import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, timeout } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jobV2 = environment.job_interaction_base_url_V2;
  ss_ai = environment.ss_ai;

  localhostBacked=environment.localhostBacked
  developer_base_url = environment.developer_base_url;
  // sessionBase = environment.session_base_url;
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    // private _utility : UtilityService,
    private _http: HttpClient
  ) { }

  formateUser(data: any, existing?: any) {

    const user = new User(
      existing?.data?.developerData?.email_before_ai_interview,
      existing?.data?.developerData?.engineer_email,
      existing?.data?.developerData?.engineer_id,
      data?.body?.data?.engineer?.user_id,
      data.headers.get('authorization'),
    );

    return user;
  }

  aiInterviewStart(projectId?: string, id?: string) {
    return this._http.get(`${this.jobV2}ai-interview-start/${projectId}/${this.base64Encode(id)}`).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));
  }
  examIdVerfity(payload:any)
  {
    // GGQK72COP2
    // let payload={"exam_id" : id}
    
    return this._http.post(`${this.ss_ai}interviews/verify-exam`, payload,{ observe: 'response' }).pipe(
      timeout(75000),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  

  saveEmailAiInterview(projectId?: string, id?: string, payload?: any): Observable<any> {
    return this._http.post(`${this.jobV2}save-email-ai-interview/${this.base64Encode(id)}/${projectId}`, payload).pipe(
      timeout(75000),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );

  }

  gerRateTokenForAI(data: any) {
    return this._http.post(`${this.developer_base_url}generate-token-for-ai-interview`, data,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response'
      }
    );
  }
  base64Encode(stringText: any): string {
    return window.btoa(stringText);
  }

  base64Decode(stringText: any): string {
    return window.atob(stringText);
  };

  // Get Local storage data
  getLocalStorageData() {
    const user = JSON.parse(localStorage.getItem('AIInterViewUser') || '');
    return user;
  };

  /**
  * This function are provide localstorage token
  */
  get userToken(): boolean {
    return localStorage.getItem('AIInterViewUser') != undefined;
  }
  get interviewInProgress(): boolean {
    
    return localStorage.getItem('interviewInProgress') != undefined;


  }
  reSendExamId(data :any){
    return this._http.post(`${this.ss_ai}interviews/reshare-interview-link`, data,).pipe(
      timeout(75000),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  reportIssue(data :any){
    return this._http.post(`${this.ss_ai}interviews/report-issue`, data,).pipe(
      timeout(75000),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

}
