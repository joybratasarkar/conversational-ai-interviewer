import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { InstructionService } from 'src/app/core/services/instruction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InternetSpeedService } from 'src/app/core/services/internet-speed.service';
import { SpeedTestService } from 'ng-speed-test';

@Component({
  selector: 'app-introduction-screen',
  templateUrl: './introduction-screen.component.html',
  styleUrls: ['./introduction-screen.component.scss']
})
export class IntroductionScreenComponent implements OnInit, OnDestroy {
  instructions: any = false;
  private signedUrl: string = ''
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public webcamImage!: WebcamImage;
  private webcamImageToFile!: any;
  profileScore: any = 0;
  public savedFileName!: string;
  public bucketUrl!: string;
  public img = "";
  private _unsubscribe$ = new Subject<boolean>();
  public showSpinner$ = new BehaviorSubject<boolean>(false);

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 1024},
    height: {ideal: 12000}
  };
  // public pictureTaken = new EventEmitter<WebcamImage>();
  loadingInternerSpeed$ = new BehaviorSubject<boolean>(false);
  id: any
  projectId: any
  engineer_id: any;
  constructor(
    private captureService: NgxCaptureService,
    private service: InstructionService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private speedTestService: SpeedTestService



  ) { }

  ngOnInit(): void {
    

    setTimeout(() => {
      this.loadingInternerSpeed$.subscribe({
        next: (loading: boolean) => {

          if (loading) {
            return;
          }

          let score = 10;
          const increment = () => {
            if (score < 100) {
              score += 20;
              this.profileScore = score;
              setTimeout(increment, 50);
            } else {
              decrement();
            }
          };

          const decrement = () => {
            if (score > 10) {
              score -= 1;
              this.profileScore = score;
              setTimeout(decrement, 50); // Adjust the delay as needed for the speed of decrementing
            }
          };

          increment();
        }
      });
    }, 1);


    this.speedTestService.getMbps().subscribe(
      {
        next: (speed: any) => {

          this.loadingInternerSpeed$.next(true);
          this.profileScore = Math.floor(speed)

        }
      }
    );

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    this.activatedRoute.queryParams.subscribe(params => {

      this.id = params['id'];
      this.projectId = params['projectId'];

      this.engineer_id = params['engineer_id']

    });
  }

  showInstructions() {
    this.instructions = !this.instructions
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const imageBlob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl, 'image/jpeg');

    const imageName = 'webcam_image.png';
    const imageFile = new File([imageBlob], imageName);

    this.webcamImageToFile = imageFile;
  }

  private dataURItoBlob(dataURI: string, mimeType: string): Blob {
    const byteString = atob(dataURI?.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/png' });
  }


  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  public triggerSnapshot(): void {
    this.instructions = true
    this.trigger.next();

  }
  takeAgainScreenShot() {
    this.showSpinner$.next(false)
    this.instructions = !this.instructions

  }
  public handleInitError(error: WebcamInitError): void {
    // this.errors.push(error);
  }


  // Get SignIn URL for logo

  // Post Image to S3 bucket
 
  ngOnDestroy(): void {
    this.loadingInternerSpeed$.next(true);
  }
}
