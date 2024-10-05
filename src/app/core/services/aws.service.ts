import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs';
import { environment} from '../../../environments/environment'

type BucktedType = 'video' | 'doc' | 'image' |'audio';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  base = environment.developer_base_url;

  constructor(private _http: HttpClient) { }

  /**
   * Function to get AWS signed URL
   * @param type {@link BucktedType} Type of file: 'image' | 'doc' | 'video'
   * @param fileName Name of the file
   * @returns `Observable`
   */
  getSignedUrl(type: BucktedType, fileName: string) {
    return this._http.get(`${this.base}get-signed-url-for-s3/${fileName}?type=${type}`, { headers: {} }).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));
  }

  /**
   * Function to save developer introduction video directly to S3 video bucket
   * @param url AWS S3 bucked signed url
   * @param file File to upload to S3
   * @param reportProgress `Boolean` Whether to show progress bar
   * @returns `Observable`
   */
  uploadFileToS3(url: string, file: any, reportProgress = true) {
    return this._http.put(`${url}`, file, { reportProgress: reportProgress, observe: 'events', headers: undefined }).pipe(timeout(75000), catchError((error: HttpErrorResponse) => {
      throw error;
    }));
  }
}
