import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  jobV2 = environment.job_interaction_base_url_V2;
  jobIntV1 = environment.job_interaction_base_url_V1;
  userBaseUrl=environment.developer_base_url_recruiter

  constructor(
    private _http: HttpClient
  ) { }


  createInterview(id?: any): Observable<HttpResponse<any>> {
    return this._http.get<any>(`${this.jobV2}create-interview-02/${this.base64Encode(id)}`)
      .pipe(map((response: any) => {
        return response;
      }));
  }
  usersAiInterviewer(id?: any): Observable<HttpResponse<any>> {
    return this._http.get<any>(`${this.jobV2}users-ai-interviewer-data/${this.base64Encode(id)}`)
      .pipe(map((response: any) => {
        return response;
      }));
  }
  sampletest(): Observable<HttpResponse<any>> {
    return this._http.get<any>('https://dev-api.supersourcing.com/ai-interviewer/root', { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          return response;
        })
      );
  }

  nextQuestion(payload?: any, id?: any): Observable<HttpResponse<any>> {
    return this._http.post<any>(`${this.jobV2}next-interview-question-02/${this.base64Encode(id)}`, payload)
      .pipe(map((response: any) => {
        return response;
      }));
  }
  audioToText(answer?: any, id?: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'file',
    });
    return this._http.post<any>(`${this.jobV2}get-text-from-audio`, answer
    )
      .pipe(map((response: any) => {
        return response;
      }));
  }

  base64Encode(stringText: any): string {
    return window.btoa(stringText);
  }
  saveVideo(payload: any): Observable<HttpResponse<any>> {
    return this._http.post<any>(`${this.userBaseUrl}upload-video-on-castr`, payload, { observe: 'response' });
  }

  saveVideoLink(payload: any): Observable<HttpResponse<any>> {
    return this._http.post<any>(`${this.jobIntV1}interview-link/save-interview-links`, payload, { observe: 'response' });
  }
}
