import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    awsS3Url: RegExp = /supersourcing-(video|doc|img)-(dev|prod).s3.ap-south-1.amazonaws.com/
    constructor(
        private _auth: AuthService
        // _auth: 
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        if (!this.awsS3Url.test(request.url)) {
            
            const token: any = JSON.parse(localStorage.getItem('AIInterViewUser') || 'null') ;
            if (!this._auth.userToken) {
                return next.handle(request);
            }
            let mofifiedReq = request.clone({
                setHeaders: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `${token?.token}`
                }
            });
            return next.handle(mofifiedReq).pipe(
                map((event: HttpEvent<any>) => {
                    return event;
                }),
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    if (httpErrorResponse?.error?.isTrusted) {
                        // let toastr: any = { icon: 'gpp_maybe', title: 'Error:', message: 'Please Check Your Internet Connection' };
                        // this._utility.openSnackBar(toastr, 'danger');
                    }
                    throw (httpErrorResponse)
                }),
            );
        }
        else {
            return next.handle(request);
        }
    }

}