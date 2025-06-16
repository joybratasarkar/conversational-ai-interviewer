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
  private connectionBargInDetectionSocket: any
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
  // test_url_for_ai_interview = environment.test_url_for_ai_interview;
  // test_url_for_ai_interview = environment.socket_ai_interview;

  test_url_for_ai_interview = environment.socket_ai_interview;
  
  public interviewQuestionCompleteSentence$ = new BehaviorSubject<any>('');
  public resumeUploaded$ = new BehaviorSubject<any>(false);
  canShowNoiseWarning = true;

  constructor(private activatedRoute: ActivatedRoute,
    private speechToText: TextToSpeechService,
    private router: Router,
    private toastr: ToastrService,
    private intructionService: InstructionService,
    private route: ActivatedRoute


  ) {

  console.log('test_url_for_ai_interview', this.test_url_for_ai_interview);

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


      // WebSocket connection opens
      this.socket.onopen = () => {
        console.log('WebSocket connected');

        this.socket.send(JSON.stringify({
          type: 'StartInterview',
          data: ''
        }));
      };

      // Handle incoming messages from the backend WebSocket
      this.socket.onmessage = (event: MessageEvent) => {
        let messageData = JSON.parse(event.data);
        // this.isAudioIsBeingPlaying$.next(true)

        this.interviewQuestion$.next(messageData?.data)
        this.interviewQuestionCompleteSentence$.next(messageData?.data);
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


  sendAnswer(answer: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      
      this.socket.send(JSON.stringify(answer));
    } else {
      console.warn('WebSocket is not open. Cannot send answer.');
    }
  }
  UPLOAD_RESUME() {
    // this.socket.send('UPLOAD_RESUME');

  }


  submitAnswer(answer: any) {
    
    this.socket.send(JSON.stringify(answer));
  }

  fileSent(fileData: any) {
    // this.socket.send(fileData);

  }


  reconnectWebSocket(): void {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connectWebSocket();
    }, this.reconnectDelay);
  }



  async connectionSilienceDetection(): Promise<void> {
    try {
      let wsUrl = `${this.test_url_for_ai_interview}silenceDetection`;

      this.connectionSilienceDetectionSocket = new WebSocket(wsUrl);

      this.connectionSilienceDetectionSocket.onopen = () => {
        console.log('Silence detection socket connected');
      };

      this.connectionSilienceDetectionSocket.onmessage = (event: MessageEvent) => {
        try {
          console.log(event?.data)
          let jsonData = event?.data;
          const jsonObject = JSON.parse(jsonData);
          // let silence_detected = jsonObject?.silence_detected === true;

          // let overall_dBFS_int = jsonData.overall_dBFS_int;

          // if (overall_dBFS_int <= -20 && this.canShowNoiseWarning) {
          //   this.toastr.warning('Too much noise');
          //   this.canShowNoiseWarning = false;
          //   setTimeout(() => this.canShowNoiseWarning = true, 5000);
          // }

          if (jsonObject?.silence_detected == true) {
            // this.sendClearAudio();
            console.log('Silence detected:', jsonObject?.silence_detected);

            // console.log('jsonData', jsonData);
            this.SilienceDetech$.next({ bool: true, completeBlob: '' });
          }

        } catch (e) {
          console.warn('Non-JSON message:', event.data); // for debugging
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





  // Handler for when a barge-in is detected
  handleBargeInDetected(): void {
    // Add logic to handle the barge-in, such as stopping AI speech, displaying a notification, etc.
    console.warn('User has interrupted the AI. Pausing response.');
    // Example: Stop the AI or take some other action
  }

}



// 