import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RealtimeSpeechToTextTranscriptionService } from 'src/app/core/services/speech-to-text.service';
import { VideoRecordingService } from 'src/app/core/services/video-recording.service';
import { TextToSpeechService } from 'src/app/core/services/tect-to-speech.service';
import { ScreenRecordingService } from 'src/app/core/services/screen-recording.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AwsService } from 'src/app/core/services/aws.service';
import { SocketRealTimeCommunicationService } from 'src/app/core/services/socket-real-time-communication.service';
import { MicrophonePermissionDialogComponent } from 'src/app/core/dialog/microphone-permission-dialog/microphone-permission-dialog.component';

type RecordingState = 'NONE' | 'RECORDING' | 'RECORDED';
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

@Component({
  selector: 'app-ai-interview-screen',
  templateUrl: './ai-interview-screen.component.html',
  styleUrls: ['./ai-interview-screen.component.scss'],
  animations: [
    trigger('blink', [
      state('on', style({ opacity: 1 })),
      state('off', style({ opacity: 0 })),
      transition('on <=> off', [animate('0.5s')]),
    ]),
  ],
})
export class AiInterviewScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollframe', { static: true }) scrollframe!: ElementRef;
  private scrollContainer: any;
  playVoice: any = false;
  instructions: any = false;
  startInterview: any = true;
  isAudioRecording = false;
  showAudioRecorder = false;
  ShowstartAudioRecording: boolean = true;
  questions!: any[];
  answers!: any[];
  mergedMessages!: any[];
  interviewInProgress: boolean | unknown = false;
  candidateImg!: string | unknown;
  id: any;
  projectId: any;
  display: any;
  displayLogout: any;
  displaySubmitAnswer: any;
  speech: string = '';
  subtitle: string = '';
  voice = '';
  public timerInterval: any;
  secondsLeft: number = 0;
  showAnswerLoadingIndex: any;
  private isAudioBlobReceived: boolean = false;
  public engineer_name!: any;
  isBlinking: boolean = false;
  private playbackRate: number = 0.5;

  private _unsubscribe$ = new Subject<boolean>();

  public interviewerCompleted$ = new BehaviorSubject<boolean>(false);

  public interviewerLoader$ = new BehaviorSubject<boolean>(false);

  public interviewInProgress$ = new BehaviorSubject<boolean>(false);

  public answersLoader$ = new BehaviorSubject<boolean>(false);

  public showAnswerLoading$ = new BehaviorSubject<boolean>(false);

  private pitchResultSubject$: Subject<string> = new Subject<string>();

  private backbuttonSubscription!: Subscription;
  tabSwitchSubscription!: Subscription;
  tabIsActive = true;
  audioUrlMp3: string | unknown;
  totalQuestions!: any;
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  @ViewChild('screenRecord', { static: true }) screenRecordElement!: ElementRef;
  @ViewChild('resultP') resultP!: ElementRef;
  private ringBufferFull: boolean = false;
  private ringBuffer: (AudioBuffer | null)[] = [];
  private ringBufferCapacity: number = 50; // Capacity of the ring buffer
  private ringBufferStart: number = 0;
  private ringBufferEnd: number = 0;
  video: any;
  displayControls = true;
  isVideoRecording = false;
  videoRecordedTime = '';
  videoBlobUrl: any;
  screenRecordBlobUrl: any;
  hideSubmitText: boolean = false;
  videoBlob: any;
  videoName = '';
  videoStream: MediaStream | null = null;

  videoConf = {
    type: 'video',
    video: {
      facingMode: 'user',
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 24, max: 30 },
    },
  };

  private audioContext: AudioContext;
  private gainNode!: GainNode;  // Define the gainNode property

  private audioDecoderWorker: Worker | any;
  countdownValue: number = 4;
  countdownValueForSentAnswer: number = 3;
  countdownInterval: any = null;
  countdownIntervalForSentAnswer: any = null;

  private audioBufferQueue: AudioBuffer[] = [];
  private isPlaying: boolean = false;
  screenRecordvideo: any;
  state: RecordingState = 'NONE';
  interviewQuestion: string = '';
  showPause: boolean = false;
  showSubmitAnswer: boolean = false;
  private audioWorker!: Worker;
  private isApiResponseComplete: boolean = false;  // To track when API response is done

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _router: Router,
    private _awsService: AwsService,
    public dialog: MatDialog,
    public RealtimeTranscription: RealtimeSpeechToTextTranscriptionService,
    private VideoRecording: VideoRecordingService,
    private ref: ChangeDetectorRef,
    private speechToText: TextToSpeechService,
    private ScreenRecordingService: ScreenRecordingService,
    public SocketRealTimeService: SocketRealTimeCommunicationService
  ) {
    this.ScreenRecordingService.getMediaStream().subscribe((data) => {
      this.screenRecordvideo.srcObject = data;
      this.ref.detectChanges();
    });
    this.ScreenRecordingService.getBlob().subscribe((data) => {
      this.screenRecordBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
      this.screenRecordvideo.srcObject = null;
      this.ref.detectChanges();
    });

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: 'interactive', // Low latency mode for smooth real-time audio
      sampleRate: 44100, // Set sample rate for consistency across devices
    });


    // Initialize the Web Worker
    if (typeof Worker !== 'undefined') {
      // Create a new Web Worker
      this.audioWorker = new Worker(new URL('src/assets/audio-decoder.worker', import.meta.url));


    } else {
      console.error('Web Workers are not supported in this environment.');
    }

    this.VideoRecording.recordingFailed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        this.isVideoRecording = false;
        this.ref.detectChanges();
      });

    this.VideoRecording.getRecordedTime()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((time) => {
        this.videoRecordedTime = time;
        this.ref.detectChanges();
      });

    this.VideoRecording.getStream()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((stream) => {
        this.videoStream = stream;
        this.ref.detectChanges();
      });

    this.VideoRecording.getRecordedBlob()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: any) => {
        this.ref.detectChanges();

        this.videoBlob = data?.blob;
        this.videoName = data?.title;
        this._downloadFile(this.videoBlob, 'video/mp4', this.videoName);

        this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data.url);

        this.ref.detectChanges();
      });
  }
  private ringBufferUsage(): number {
    if (this.ringBufferEnd >= this.ringBufferStart) {
      return this.ringBufferEnd - this.ringBufferStart;
    }
    return this.ringBufferCapacity - this.ringBufferStart + this.ringBufferEnd;
  }

  ngOnInit(): void {
    this.start();
    this.startBlinking();

    this.SocketRealTimeService.connectWebSocket();

    this.SocketRealTimeService.ConnectionQuestionAnswerSocket();

    this.SocketRealTimeService.interviewQuestion$.subscribe({
      next: (resp: any) => {
        this.interviewQuestion = resp;
      },
    });

    this.speechToText.speechTranslatedEnd$
      .pipe(
        filter((bool: boolean) => bool === true),
        takeUntil(this._unsubscribe$)

      )
      .subscribe({
        next: (resp: any) => {
          // this.audioBufferQueue = [];
          this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false);
          // if (this.audioContext) {
          this.isApiResponseComplete = true
          //   this.audioContext.close();
          // }

          // if (this.audioDecoderWorker) {
          //   this.audioDecoderWorker.terminate();
          // }
        },
      });

    this.startCountdown();

    this.speechToText.speechTranslated$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (resp: any) => {
          this.playAudioChunk(resp);
          this.isApiResponseComplete = false
          this.SocketRealTimeService.isAudioIsBeingPlaying$.next(true);

        },
      });

    this.speech = '';
    this.subtitle = '';

    this.RealtimeTranscription.subtitle$
      .pipe(filter((resp: any) => resp !== null))
      .subscribe({
        next: (resp: any) => {
          this.showPause = false;
          this.subtitle = resp;
        },
        error: (err: any) => {
          console.error('Error:', err);
        },
        complete: () => { },
      });

    this.RealtimeTranscription.translationData$
      .pipe(
        filter((data) => data !== null),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe$)
      )
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.hideSubmitText = true;
            this.SocketRealTimeService.sendAnswer(res);
            this.subtitle = '';
            this.countdownValueForSentAnswer = 3;

            this.countdownIntervalForSentAnswer = setInterval(() => {
              this.countdownValueForSentAnswer--;
              if (this.countdownValueForSentAnswer > 0) {
                // console.log(this.countdownValueForSentAnswer);
              } else {
                this.hideSubmitText = false;
                clearInterval(this.countdownIntervalForSentAnswer);
                this.subtitle = '';
                this.countdownValueForSentAnswer = 0;
              }
            }, 1000);
          }
        },
      });

    this.activatedRoute.queryParams
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((params) => {
        this.id = params['id'];
        this.projectId = params['projectId'];
      });
  }

  startCountdown() {
    console.log(`Recording starts in ${this.countdownValue} seconds...`);

    this.countdownInterval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        // console.log(this.countdownValue);
      } else {
        clearInterval(this.countdownInterval);

        this.startAudioRecording();
      }
    }, 1000);
  }

  startBlinking() {
    setInterval(() => {
      this.isBlinking = !this.isBlinking;
    }, 5000);
  }





  // Adjusted audio playback to reduce latency
  async playAudioChunk(base64Data: string) {
    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Send base64 data to Web Worker
      this.audioWorker.postMessage({ base64Data });

      this.audioWorker.onmessage = async ({ data }) => {
        const arrayBuffer = data;
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.enqueueToRingBuffer(audioBuffer);

        if (!this.isPlaying && this.ringBufferUsage() >= 5) {
          this.playNextChunk();
        }
      };
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    }
  }

// Helper function to create the source and gain node
createSource(buffer: AudioBuffer) {
  const source = this.audioContext.createBufferSource();
  const gainNode = this.audioContext.createGain();

  source.buffer = buffer;
  // Connect source to gain node
  source.connect(gainNode);
  // Connect gain node to destination
  gainNode.connect(this.audioContext.destination);

  return { source, gainNode };
}
applyTremoloWithCurve() {
  const DURATION = 2;
  const FREQUENCY = 1;
  const SCALE = 0.4;
  const valueCount = 4096;
  const values = new Float32Array(valueCount);

  for (let i = 0; i < valueCount; i++) {
    const percent = (i / valueCount) * DURATION * FREQUENCY;
    values[i] = 1 + (Math.sin(percent * 2 * Math.PI) * SCALE);
    if (i === valueCount - 1) {
      values[i] = 1; // Restore to normal at the end
    }
  }

  // Apply it to the gain node over a 2-second duration
  this.gainNode.gain.setValueCurveAtTime(values, this.audioContext.currentTime, DURATION);
}


applyTremoloWithOscillator(gainNode: GainNode) {
  const DURATION = 2;
  const FREQUENCY = 0.5; // Reduced frequency for smoother effect
  const SCALE = 0.3; // Less aggressive tremolo

  const osc = this.audioContext.createOscillator();
  osc.frequency.value = FREQUENCY;

  const gain = this.audioContext.createGain();
  gain.gain.value = SCALE;

  osc.connect(gain);
  gain.connect(gainNode.gain);

  osc.start();
  osc.stop(this.audioContext.currentTime + DURATION);
}


// Optimized playback function with fading effects
private async playNextChunk() {
  if (this.isPlaying || this.isRingBufferEmpty()) return;

  const audioBuffer = this.dequeueFromRingBuffer();
  if (!audioBuffer) {
    this.isPlaying = false;
    return;
  }

  try {
    const currTime = this.audioContext.currentTime;
    const fadeTime = 0.1; // Adjusted fade time for smoother transitions

    // Create the source and gain node
    const { source, gainNode } = this.createSource(audioBuffer);

    // Apply tremolo effect
    this.applyTremoloWithOscillator(gainNode); // Use oscillator-based tremolo

    const duration = audioBuffer.duration;

    // Apply fade in and fade out smoothly
    gainNode.gain.setValueAtTime(0, currTime); // Start at 0 gain
    gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime); // Fade in
    gainNode.gain.setValueAtTime(1, currTime + duration - fadeTime); // Maintain volume
    gainNode.gain.linearRampToValueAtTime(0, currTime + duration); // Fade out

    // Start playback and ensure proper timing
    source.start(currTime);

    this.isPlaying = true;

    // Wait for the current audio chunk to finish before moving to the next
    source.onended = () => {
      this.isPlaying = false;
      source.disconnect(); // Disconnect after playback
      gainNode.disconnect();
      this.playNextChunk(); // Proceed to the next chunk
    };
  } catch (error) {
    console.error('Error playing audio chunk:', error);
    this.isPlaying = false;
  }
}






  // Ring Buffer enqueue function
  private enqueueToRingBuffer(audioBuffer: AudioBuffer) {
    this.ringBuffer[this.ringBufferEnd] = audioBuffer;

    // Overwrite the oldest data if the buffer is full
    if (this.ringBufferFull) {
      this.ringBufferStart = (this.ringBufferStart + 1) % this.ringBufferCapacity;
    }

    this.ringBufferEnd = (this.ringBufferEnd + 1) % this.ringBufferCapacity;

    // If end and start positions match, buffer is full
    this.ringBufferFull = this.ringBufferEnd === this.ringBufferStart;
  }


  // Ring Buffer dequeue function
  private dequeueFromRingBuffer(): AudioBuffer | null {
    if (this.isRingBufferEmpty()) {
      return null;
    }

    const audioBuffer = this.ringBuffer[this.ringBufferStart];
    this.ringBuffer[this.ringBufferStart] = null; // Clear the slot

    this.ringBufferStart = (this.ringBufferStart + 1) % this.ringBufferCapacity;
    this.ringBufferFull = false; // After dequeueing, buffer cannot be full

    return audioBuffer;
  }

  // Check if ring buffer is empty
  private isRingBufferEmpty(): boolean {
    return !this.ringBufferFull && this.ringBufferStart === this.ringBufferEnd;
  }



  private onPlaybackEnd() {
    console.log('Playback finished');
    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false);
    // Ensure the audio context is closed or suspended if not playing anymore
    if (this.audioContext.state !== 'closed') {
      // this.audioContext.suspend();  // Suspend or close the AudioContext to save resources
    }
    // Perform any cleanup or UI updates here
  }

  toggleRecording() {
    if (!this.isVideoRecording) {
      this.startVideoRecording();
    }
  }

  startVideoRecording() {
    if (!this.isVideoRecording) {
      this.video.controls = false;
      this.isVideoRecording = true;
      this.VideoRecording.startRecording(this.videoConf)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }

  abortVideoRecording() {
    if (this.isVideoRecording) {
      this.isVideoRecording = false;
      this.VideoRecording.abortRecording();
      this.video.controls = false;
    }
  }

  stopVideoRecording() {
    try {
      if (this.isVideoRecording) {
        this.VideoRecording.stopRecording();

        this.video.srcObject = this.videoBlobUrl;
        this.isVideoRecording = false;
        this.video.controls = true;
      }
    } catch (err) {
      console.error('Error stopping video recording:', err);
    }
  }

  clearScreenRecordedData() {
    this.screenRecordBlobUrl = null;
    this.video.srcObject = null;
    this.video.controls = false;

    this.ref.detectChanges();
  }

  // Function to download the video recorded data and initiate upload
  downloadVideoRecordedData() {
    console.log('Downloading recorded video data...');

    this._downloadFile(this.videoBlob, 'video/mp4', this.videoName);
  }

  // Function to download the file and initiate the upload process
  _downloadFile(data: any, type: string, filename: string) {
    try {
      const videoFile = new File(
        [data],
        `${this.engineer_name.split(' ').join('_')}-interview_video.mp4`,
        { type: 'video/mp4' }
      );

      const blob = new Blob([data], { type: type });

      this.getSignedUrlforVideo(videoFile, filename);
    } catch (err) {
      console.error('Error processing the download file:', err);
    }
  }

  // Function to get signed URL for the video file
  getSignedUrlforVideo(videoFile: File, filename: string) {
    console.log('Requesting signed URL for video file...');
    this._awsService
      .getSignedUrl('video', filename)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (response: any) => {
          const data = response?.data;
          if (data?.signedUrl && data?.fileDatedName) {
            console.log('Signed URL received:', data.signedUrl);

            this.postVideoToS3(data.signedUrl, videoFile, data.fileDatedName);
          } else {
            console.error('Invalid response data:', data);
          }
        },
        error: (err: any) => {
          console.error('Error getting signed URL:', err);
        },
      });
  }

  // Function to upload the video file to S3 using the signed URL
  postVideoToS3(url: string, file: File, savedFileName: string) {
    console.log('Uploading video to S3...');
    this._awsService
      .uploadFileToS3(url, file)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        complete: () => {
          const videoUrlParts = url.split('?')[0]; // Extract the base URL without query parameters

          const payload = {
            interaction_id: this.id,
            links: [videoUrlParts],
          };

          // Implement your service method to save the video link
          // this.service.saveVideoLink(payload).subscribe({
          //   next: (resp: any) => {
          //     console.log('Video link saved successfully:', resp);
          //   },
          //   error: (err: any) => {
          //     console.error('Error saving video link:', err);
          //   },
          // });
        },
        error: (err: any) => {
          console.error('Error uploading video to S3:', err);
        },
      });
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
    this.toggleRecording();
  }

  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.showAudioRecorder = true;
      this.ShowstartAudioRecording = false;

      this.RealtimeTranscription.connectWebSocket();

      this.SocketRealTimeService.connectionSilienceDetection();

      this.SocketRealTimeService.clearAudioSegmentSocket();

      this.checkAudioMuted();
    }
  }

  checkAudioMuted() {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        }
      })
      .then((stream) => {
        const audioTrack = stream.getAudioTracks()[0];
        const isMuted = audioTrack.muted;

        if (isMuted) {
          this.toastr.warning('Audio is muted');
        } else {
          console.log('Audio is not muted');
        }

        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => {
        console.error('Error accessing audio stream:', error);
      });
  }

  hasEndedInterview() {
    this.interviewerLoader$.next(false);

    this.ShowstartAudioRecording = false;

    this.interviewerCompleted$.next(true);

    this.stopVideoRecording();

    this.isAudioRecording = false;
    this.ShowstartAudioRecording = false;
    this.logout();
  }

  logout() {
    // Implement logout logic here
  }

  start() {
    this.timer(30); // Set to 30 minutes
  }

  timer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) textSec = '0' + statSec;
      else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.secondsLeft = seconds;

      // Warning when 10 seconds left
      if (this.secondsLeft == 10) {
        this.toastr.warning('Ten seconds left.');
        this.hasEndedInterview();
      }

      // When the timer reaches 0
      if (seconds == 0) {
        clearInterval(this.timerInterval);
        this.logout();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();

    this.clearScreenRecordedData();

    this.speechToText.closeSocket();


    this.RealtimeTranscription.closeWebSocket();

    this.SocketRealTimeService.closeWebSocket()

    this.SocketRealTimeService.closeSilienceDetectionWebSocket()

    this.SocketRealTimeService.Close_Socket_clearAudioSegment()

    this.SocketRealTimeService.Close_Socket_questionAnswerSocket()


    if (this.audioContext) {
      this.audioContext.close();
    }

    if (this.audioDecoderWorker) {
      this.audioDecoderWorker.terminate();
    }
  }
}
