import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou-screen',
  templateUrl: './thankyou-screen.component.html',
  styleUrls: ['./thankyou-screen.component.scss']
})
export class ThankyouScreenComponent implements OnInit {

  user : any
  userFirstName : any
  projectId :any
  displayLogout: any
  public timerInterval: any;
  IsShow: boolean = false;
  role_name:any
  constructor(
    private _router: Router,
  ) {

  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }


  ngOnInit(): void {
    this.user = localStorage.getItem('user');

  

    // this.projectId = this.route.snapshot.queryParams['projectId'];

    if (this.user) {
      this.user = JSON.parse(this.user); 
      this.role_name=this.user.candidate_info.asset_roles.role_name

     this.userFirstName = this.user.candidate_info.first_name;
    //  this.projectId = this.user.job_id;
    } 
    
    // this.timerForSecondLogout()
    // this.pauseBefore()
  }


  pauseBefore(): void {
    
    setTimeout(() => {
      this.IsShow = true;
    }, 4800);
  }


  timerForSecondLogout() {
    let seconds: number = 10;
    let textSec: any = '0';
    let statSec: number = 10; 

    this.displayLogout = '00:10'; 

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 9; 

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayLogout = `00:${textSec}`;

      if (seconds == 0) {

        clearInterval(this.timerInterval);
     
        // this.logout(); 
      }
    }, 1000);
  }

  logout() {
    localStorage.removeItem("AIInterViewUser");
    localStorage.removeItem("interviewInProgress");
    this._router.navigate(['/instructions-screen/thankyou']);
    localStorage.removeItem("total_questions");

  }

}
