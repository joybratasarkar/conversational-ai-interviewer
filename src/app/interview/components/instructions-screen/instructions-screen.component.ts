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

  constructor (
    private router :Router,
    private route : ActivatedRoute,
    private utility :UtilityService,
    private instructionService :InstructionService

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
          let payload = {
            "candidate_interaction_id": 401,
            "stage": "Interview Started",
          }
          
          this.instructionService.startEndInterview(payload).subscribe({
            next : (res :any )=>{
              console.log('res', );
              if(res.statusCode == 200){
                this.router.navigate(['instructions-screen/ai-interview-screen'], 
            { queryParams: { projectId: this.projectId } }
          );
              }
              
            },error : (err :any)=>{
              console.error(err)
            }
          })

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