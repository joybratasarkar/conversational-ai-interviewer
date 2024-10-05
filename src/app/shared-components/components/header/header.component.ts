import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from 'src/app/core/services/interview.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  id: any
  projectId: any
  engineer_name!: any 
  role_name:any

constructor(
  private service: InterviewService,
  private activatedRoute: ActivatedRoute,

){}



ngOnInit(): void {
  let userRole:any = JSON.parse(localStorage.getItem('user') || '');
  

  this.role_name=userRole.candidate_info.asset_roles.role_name
  this.activatedRoute.queryParams.subscribe(params => {
    // this.start()

    this.id = params['id'];
    this.projectId = params['projectId'];
    // this.usersAiInterviewer()

  });
}

  usersAiInterviewer() {
    this.service.usersAiInterviewer(this.id).subscribe({
      next: (resp: any) => {

        this.engineer_name = resp?.data?.interview?.engineer_name

      }
    })
  }
}
