import { Injectable } from '@angular/core';
// import RecordRTC from 'recordrtc';
import { Observable, Subject } from 'rxjs';
// import moment from "moment";
import * as moment from 'moment';
import * as RecordRTC from 'recordrtc';

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}
@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
  private stream!:any|unknown;
  private recorder!:any|unknown;
  private interval!:any|unknown;
  private startTime!:any|unknown;
  private isPaused = false; // New property to track pause state
  private elapsedTime = 0; // New property to track elapsed time

  private _recorded = new Subject<RecordedAudioOutput>();
  private _recordingTime = new Subject<any>();
  private _recordingFailed = new Subject<any>();

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        this.stream = s;
        this.record();
      })
      .catch((error) => {
        this._recordingFailed.next(error);
      });
  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/wav'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(() => {
      const currentTime = moment();
      const diffTime = moment.duration(currentTime.diff(this.startTime));
      const time =
        this.toString(diffTime.minutes()) +
        ':' +
        this.toString(diffTime.seconds());
      this._recordingTime.next(time);
    }, 500);
  }

  private toString(value:any) {
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
      this.recorder.stop(
        (blob:any) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent(
              'audio_' + new Date().getTime() + '.mp3'
            );
            this.stopMedia();
            
            this._recorded.next({ blob: blob, title: mp3Name });
          }
        },
        () => {
          this.stopMedia();
          this._recordingFailed.next(null);
        }
      );
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track:any) => track.stop());
        this.stream = null;
      }
    }
  }
}
