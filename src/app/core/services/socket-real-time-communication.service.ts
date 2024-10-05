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
    private intructionService :InstructionService,
    private route :ActivatedRoute


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
      let wsUrl = `${this.socket_ai_interview}ws`;

      this.socket = new WebSocket(wsUrl);
      // console.log('this.socket', this.socket);
      let user = localStorage.getItem('user');
      let data
      if (user) {
        data = JSON.parse(user);
        this.exam_id = data.exam_id
        // this.userFirstName = this.user.candidate_info.first_name;
        //  this.projectId = this.user.job_id;
      }

      // this.connectionSilienceDetection();

      this.socket.onopen = () => {
        let data = {
          job_id: this.id,
          projectId: this.projectId,
          exam_id: this.exam_id
        };

        this.socket.send(JSON.stringify(data));
      };
      this.socket.onmessage = (event: MessageEvent) => {
        // Notify that audio is being played
        // this.isAudioIsBeingPlaying$.next(true);


        let conversationObj: any;

        // Try to parse the incoming data as JSON
        try {
          conversationObj = JSON.parse(event?.data);  // Parse event.data directly
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // If not valid JSON, treat it as plain text
          conversationObj = { question: event?.data };
        }

        // Ensure that the parsed object contains the expected properties
        if (conversationObj && conversationObj.question !== undefined) {
          // Pass the question to the observables
          this.interviewQuestion$.next(conversationObj.question);
          this.interviewQuestionNumber$.next(conversationObj.question_number);

          // Call the speech-to-text function
          this.speechToText.onOpenSocket(conversationObj.question);
        } else {
          // Handle case where question is not found
          console.warn('Received event data without a valid question:', event?.data);
          this.speechToText.onOpenSocket(event?.data); // Fallback to the raw data
        }

        // console.log('Received message from WebSocket:', event.data);
      };


      this.socket.onclose = (event: CloseEvent) => {
        console.warn(`WebSocket closed: ${event.reason}`);
        this.reconnectWebSocket();
      };

      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        this.socket.close();
      };
    } catch (error) {
      console.error('Error:', error);
      // this.reconnectWebSocket();
    }
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


  async ConnectionQuestionAnswerSocket(): Promise<void> {

    let wsUrl = `${this.socket_ai_interview}questionAnswering`;

    this.questionAnswerSocket = new WebSocket(wsUrl);

    this.questionAnswerSocket.onopen = () => {

      // this.sendAnswer(test)
      // this.connectionSilienceDetection();


    };

    this.questionAnswerSocket.onmessage = (event: any) => {
      // console.log('answe=============================================', event.data);
      // this.connectWebSocket()
      // this.isAudioIsBeingPlaying$.next(true)

      const conversationObj = JSON.parse(event.data);  // Parse event.data directly


      this.interviewQuestion$.next(conversationObj.question)
      this.interviewQuestionNumber$.next(conversationObj.question_number)

      // this.connectionSilienceDetectionSocket()
      this.speechToText.onOpenSocket(conversationObj?.message);

      if (conversationObj?.interViewEnd === true) {
    let payload = {
      candidate_interaction_id: 15,
        stage: "Interview Completed",

    }
    this.intructionService.startEndInterview(payload).subscribe({
      next : (res :any)=>{
        setTimeout(() => {

          this.router.navigate(['/instructions-screen/thankyou'], {queryParams : {projectId : this.route.snapshot.queryParams['projectId']}});
          localStorage.clear();

        }, 6000);

        
      },
      error : (err :any)=>{
        console.error(err);
        
      }
    })

      }

      // this.speechToText.onOpenSocket(event.data);

    }

  }
  
  sendAnswer(eosMessage: any): void {
    let data = {
      projectId: this.id,
      sender: 'answers',
      text: eosMessage
    }
    this.questionAnswerSocket.send(JSON.stringify(data));
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