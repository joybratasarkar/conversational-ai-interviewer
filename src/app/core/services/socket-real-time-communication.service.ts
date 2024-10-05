import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextToSpeechService } from './tect-to-speech.service';
import { BehaviorSubject, Subject, debounceTime, filter, first, take } from 'rxjs';
import { environment } from '../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { InstructionService } from './instruction.service';
import { log } from 'console';


@Injectable({
  providedIn: 'root'
})
export class SocketRealTimeCommunicationService {

  id: any
  projectId: any
  private socket: any;
  private questionAnswerSocket: any;
  private connectionSilienceDetectionSocket: any
  private clearAudioSegment: any
  public SilienceDetech$ = new BehaviorSubject<any>(false);
  public SilienceDetech3Seconds$ = new BehaviorSubject<any>(false);
  public exam_id: any

  public interviewQuestion$ = new BehaviorSubject<any>('');
  public interviewQuestionNumber$ = new BehaviorSubject<number>(0);

  public isAudioIsBeingPlaying$ = new BehaviorSubject<any>(false);
  reconnectDelay: number = 1000; // 5 seconds delay before trying to reconnect

  eventDataArray: any[] = [];
  test_url_for_ai_interview = environment.test_url_for_ai_interview;
  socket_ai_interview = environment.socket_ai_interview;

  constructor(private activatedRoute: ActivatedRoute,
    private speechToText: TextToSpeechService,
    private router: Router,
    private toastr: ToastrService,
    private intructionService: InstructionService,
    private route: ActivatedRoute


  ) {


    this.activatedRoute.queryParams.pipe().subscribe(params => {

      this.id = this.base64Encode(params['id']);

      this.projectId = params['projectId'];
    });

  }
  base64Encode(stringText: any): string {
    return window.btoa(stringText);
  }

  async connectWebSocket(): Promise<void> {
    try {
      // Construct the WebSocket URL
      let wsUrl = `${this.test_url_for_ai_interview}ws`;
      this.socket = new WebSocket(wsUrl);

      // Retrieve user details from local storage (if needed)
      let user = localStorage.getItem('user');
      if (user) {
        let data = JSON.parse(user);
        this.exam_id = data.exam_id;
        this.projectId = data.projectId;
      }

      // WebSocket connection opens
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isAudioIsBeingPlaying$.next(true)

        // Optionally send some initial data if needed when opening the WebSocket
      };

      // Handle incoming messages from the backend WebSocket
      this.socket.onmessage = (event: MessageEvent) => {
        let messageData = JSON.parse(event.data);
        this.isAudioIsBeingPlaying$.next(true)
        this.interviewQuestion$.next(messageData?.question)
        this.speechToText.onOpenSocket(messageData?.question);

      };

      // Handle WebSocket close events
      this.socket.onclose = (event: CloseEvent) => {
        console.warn(`WebSocket closed: ${event.reason}`);
        this.reconnectWebSocket();  // Optionally handle reconnection
      };

      // Handle WebSocket errors
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        this.socket.close();  // Close the socket on error
      };

    } catch (error) {
      console.error('Error:', error);
    }
  }
  UPLOAD_RESUME() {
    this.socket.send('UPLOAD_RESUME');

  }

 
  submitAnswer(answer:any) {
    this.socket.send(`ANSWER:${answer}`);
  }
  
  fileSent(fileData: any) {
    this.socket.send(fileData);

  }


  reconnectWebSocket(): void {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connectWebSocket();
    }, this.reconnectDelay);
  }



  async connectionSilienceDetection(): Promise<void> {
    try {
      let wsUrl = `${this.socket_ai_interview}silenceDetection`;

      this.connectionSilienceDetectionSocket = new WebSocket(wsUrl);

      this.connectionSilienceDetectionSocket.onopen = () => {
        console.log('Silence detection socket connected');
      };

      this.connectionSilienceDetectionSocket.onmessage = (event: MessageEvent) => {
        let jsonData = JSON.parse(event.data);

        let silence_detected = jsonData.silence_detected === true;
        let overall_dBFS_int = jsonData.overall_dBFS_int;

        // let silence_detected_3 = jsonData.silence_detected_3 === true;
        // console.log('overall_dBFS_int', overall_dBFS_int);

        if (overall_dBFS_int >= -40) {
          // this.toastr.warning('Too much noise');
        }

        if (silence_detected) {
          this.sendClearAudio()

          this.SilienceDetech$.next({ bool: true, completeBlob: jsonData.completeBlob });
        }

      };

      this.connectionSilienceDetectionSocket.onclose = (event: CloseEvent) => {
        console.warn(`Silence detection WebSocket closed: ${event.reason}`);
        // this.reconnectSilienceDetectionWebSocket();
      };

      this.connectionSilienceDetectionSocket.onerror = (error: Event) => {
        console.error('Silence detection WebSocket error:', error);
        this.connectionSilienceDetectionSocket.close();
      };
    } catch (error) {
      console.error('Error:', error);
      // this.reconnectSilienceDetectionWebSocket();
    }
  }


  sendConnectionSilienceDetectionSocket(blob: any): void {
    if (this.connectionSilienceDetectionSocket && this.connectionSilienceDetectionSocket.readyState === WebSocket.OPEN) {
      this.connectionSilienceDetectionSocket.send(blob);
    } else {
      this.connectionSilienceDetection();
    }
  }


  async clearAudioSegmentSocket(): Promise<void> {

    let wsUrl = `${this.socket_ai_interview}clearAudioSegment`;

    this.clearAudioSegment = new WebSocket(wsUrl);

    this.clearAudioSegment.onopen = () => {

      // this.sendAnswer(test)
      // this.connectionSilienceDetection();


    };

    this.clearAudioSegment.onmessage = (event: any) => {

      // this.speechToText.onOpenSocket(event.data);

    }

  }

  sendClearAudio() {
    this.clearAudioSegment.send(JSON.stringify(true));

  }






  closeWebSocket(): void {

    if (this.socket) {

      this.socket.close();
      console.log('Main WebSocket connection closed');
    }
  }




  // Method to close the silence detection WebSocket connection
  closeSilienceDetectionWebSocket(): void {
    if (this.connectionSilienceDetectionSocket) {
      this.connectionSilienceDetectionSocket.close();
      console.log('Silence detection WebSocket connection closed');

    }
  }

  Close_Socket_clearAudioSegment(): void {
    if (this.clearAudioSegment) {
      this.clearAudioSegment.close();
    }
  }


  Close_Socket_questionAnswerSocket(): void {
    if (this.questionAnswerSocket) {
      this.questionAnswerSocket.close();
    }
  }
}



// 