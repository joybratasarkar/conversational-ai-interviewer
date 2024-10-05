export class User  {
    constructor(
        private email_before_ai_interview : any,
        private engineer_email : any,
        private engineer_id : string,
        public id : string,
        public token : any,
  

    ) {}


    public get userToken() : any {
        return this.token
    }
}