import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { InstructionService } from 'src/app/core/services/instruction.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-instructions-screen',
  templateUrl: './instructions-screen.component.html',
  styleUrls: ['./instructions-screen.component.scss']
})
export class InstructionsScreenComponent implements OnInit {
  user : any
  userFirstName : any
  projectId :any
  mediaStream: MediaStream | undefined;
  selectedFiles: File[] = [];

  constructor (
    private router :Router,
    private route : ActivatedRoute,
    private utility :UtilityService,
  ){

  }
  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.projectId = this.route.snapshot.queryParams['projectId'];

    if (this.user) {
      this.user = JSON.parse(this.user); 
     this.userFirstName = this.user.candidate_info.first_name;
    //  this.projectId = this.user.job_id;
    } 
    

  }
 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Convert FileList to an array
    }
  }
  startInterview() {
    this.checkMediaPermissions()
    
   
  }
  
  
  
  checkMediaPermissions() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();
  
        if (videoTracks.length > 0 && audioTracks.length > 0) {
          this.mediaStream = stream;
  
          console.log('Audio and video permissions granted.');
         
          this.router.navigate(['Ai-interviewer/ai-interview-screen']) 


        } else {
          alert('Please ensure that both camera and microphone are enabled and try again.');
        }
      })
      .catch((error) => {
        alert('You need to allow camera and microphone access to proceed with the interview.');
        console.error('Error accessing media devices:', error);
      });
  }
}  