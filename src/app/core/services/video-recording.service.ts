import { Injectable, NgZone } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from "moment";
import { Observable, Subject } from 'rxjs';
interface RecordedVideoOutput {
  blob: Blob;
  url: string;
  title: string;
}
@Injectable({
  providedIn: 'root'
})
export class VideoRecordingService {
constructor(
)
{}
  private stream: any;
  private recorder: any;
  private interval: any;
  private startTime: any;
  private _stream = new Subject<MediaStream>();
  private _recorded = new Subject<RecordedVideoOutput>();
  private _recordedUrl = new Subject<string>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<any>();
  private _recordedBlob = new Subject<any>();

  public recordedBlob$ = new Subject<RecordedVideoOutput>();
  getRecordedUrl(): Observable<string> {
    return this._recordedUrl.asObservable();
  }
  getRecordedBlob(): Observable<RecordedVideoOutput> {
    return this._recorded.asObservable();
  }
  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }
  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }
  getStream(): Observable<MediaStream> {
    return this._stream.asObservable();
  }
  getStreamrecordedBlob(): Observable<MediaStream> {
    return this._recordedBlob.asObservable();
  }
  startRecording(conf: any): Promise<any> {
    var browser = <any>navigator;
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return new Promise((resolve, reject) => {
        reject();
      })
    }
    this._recordingTime.next('00:00');
    return new Promise((resolve, reject) => {
      browser.mediaDevices.getUserMedia(conf).then((stream: any) => {
        this.stream = stream;
        this.record();
        resolve(this.stream);
      }).catch((error: any) => {
        this._recordingFailed.next(false);
        reject;
      });
    });
  }
  abortRecording() {
    this.stopMedia();
  }
  private record() {
    this.recorder = new RecordRTC(this.stream, {
      type: 'video',
      mimeType: 'video/webm',
      bitsPerSecond: 44000,
      recorderType: RecordRTC.MediaStreamRecorder,
      frameInterval: 90,
      timeSlice: 1000,
      ondataavailable: (blob) => {
        this.sendBlobToSocket(blob); // Send blob to socket service

    
      }
    });
    this.recorder.startRecording();
    this.startTime = moment();
    this.interval = setInterval(() => {
      const currentTime = moment();
      const diffTime = moment.duration(currentTime.diff(this.startTime));
      const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
      this._recordingTime.next(time);
      this._stream.next(this.stream);
    }, 500);
  }
  private sendBlobToSocket(blob: Blob) {
    // Check if the blob is of type Blob
    if (!(blob instanceof Blob)) {
      console.error('Invalid blob type. Expected Blob.');
      return;
    }
  
  
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string; 
      const base64Data = base64String.split(',')[1]; 
      if (base64Data) {                
        // this.SocketService.startProcessing(base64Data);
      } else {
        console.error('Empty base64 string.');
      }
    };
    reader.readAsDataURL(blob);
  }
  
  
  

  private toString(value: any) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }
  stopRecording() {
    if (this.recorder) {
      this.recorder.stopRecording(this.processVideo.bind(this));
      //this.processVideo.bind(this.recorder)
      //this.processVideo(this.recorder);
      //this.stopMedia();
    }
  }
  private processVideo(audioVideoWebMURL: any) {
    // console.log(audioVideoWebMURL);
    
    const recordedBlob = this.recorder.getBlob();
    this.recorder.getDataURL(function (dataURL: any) { });
    const recordedName = encodeURIComponent('video_' + new Date().getTime() + '.webm');
    
    this._recorded.next({ blob: recordedBlob, url: audioVideoWebMURL, title: recordedName });
    this.recordedBlob$.next({blob: recordedBlob, url: audioVideoWebMURL, title: recordedName});
    this.stopMedia();
    //this.recorder.save(recordedName);
  }
  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: any) => track.stop());
        this.stream.getVideoTracks().forEach((track: any) => track.stop());
        this.stream.stop();
        this.stream = null;
      }
    }
  }
}




