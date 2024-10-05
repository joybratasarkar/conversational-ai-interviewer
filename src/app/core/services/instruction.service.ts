import { Injectable } from '@angular/core';
import { environment} from '../../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionService {


  jobV2 = environment.job_interaction_base_url_V2;
  ss_ai = environment.ss_ai; 
 

  constructor(
    // private _utility : UtilityService,
    private _http: HttpClient,
  ) { }
  uploadResumeAndStartInterview(Resume:File)
  {
    return this._http.post(`http://localhost:8000/upload_resume/`, Resume).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));

  }

  saveProfilePicAiInterview(id?:string,engineer_id?:string,payload?:any): Observable<any>{
    // return this._http.post(`${this.jobV2}save-email-ai-interview/${this.base64Encode(id)}/${projectId}`, payload).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
    //   throw error;
    // }));
    console.log('payload',payload);
    
    return this._http.post(`${this.jobV2}save-profile-pic-ai-interview/${this.base64Encode(id)}/${engineer_id}}`, payload).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));
    // return this._http.post(`${this.jobV2}save-profile-pic-ai-interview/Nzc5OA==/NjU5NTQyODcyNzY1MWEyYTAxNDFkNDhh}`, payload).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
    //   throw error;
    // }));
  }
  base64Encode(stringText: any): string {
    return window.btoa(stringText);
  }

  startEndInterview(data :any){
    return this._http.post(`${this.ss_ai}interaction/save-interaction-log`, data).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));
  }

 
}
