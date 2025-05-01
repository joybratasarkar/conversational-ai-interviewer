// speech-recognition.service.ts

import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, elementAt } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpeechRecognitionService {
    boo = false;
    finalTranscript:string='';

    constructor(
        private _ngZone: NgZone,

    ) {
    }
    getTranscript({ locale = 'en-US' }: { locale?: string } = {}): Observable<string> {
        const cache: { [key: string]: string } = {};
    
        return new Observable(observer => {
            
            if (cache[locale]) {
                observer.next(cache[locale]);
                observer.complete();
                return;
            }
            // @ts-ignore
            const SpeechRecognition: any = window['webkitSpeechRecognition'];
            
            if (!SpeechRecognition) {
                observer.error('SpeechRecognition is not supported on this browser.');
                return;
            }
    
            const speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = locale;
            
            let interimTranscript = '';
            let transcriptArray: string[] = [];
            
            speechRecognition.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript.trim();
                    if (event.results[i].isFinal) {
                        
                        transcriptArray.push(transcript);
                        this.finalTranscript = transcriptArray.join(' ');  
                                              
                        this._ngZone.run(() => observer.next(this.finalTranscript.trim()));
                        cache[locale] = this.finalTranscript.trim();
                        
                    }
                    else{
                        this._ngZone.run(() => observer.next(this.finalTranscript.trim()));
                    }
                }
            };
    
            speechRecognition.start();
    
            return () => speechRecognition.abort();
        });
    }
    clearTranscript(): void {
        this.finalTranscript = '';
      }
      
}
