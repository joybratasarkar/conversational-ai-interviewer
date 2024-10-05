const { writeFile } = require('fs');
const { argv } = require('yargs');
const public_env = require('./public.environment');
// read environment variables from .env file
require('dotenv').config('./config');
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'production';
let targetPath: string = './src/environments/environment.ts';
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
    export const environment: any = {
        production: ${isProduction},
        GOOGLE_PLACES_API: '${process.env['GOOGLE_PLACES_API']}',
        IP_REGISTRY_KEY: '${process.env['IP_REGISTRY_KEY']}',
        LINKEDIN_API_KEY: '${process.env['LINKEDIN_API_KEY']}',
        firebase: {
            apiKey: '${process.env['FIREBASE_API_KEY']}',
            authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
            projectId: '${process.env['FIREBASE_PROJECT_ID']}',
            storageBucket: '${process.env['FIREBASE_STORAGE_BUCKET']}',
            messagingSenderId: '${process.env['FIREBASE_MESSENGER_ID']}',
            appId: '${process.env['FIREBASE_APP_ID']}'
        },
        developer_base_url: '${public_env[environment].developer_base_url}',
        session_base_url: '${public_env[environment].session_base_url}',
        developer_base_url_V2: '${public_env[environment].developer_base_url_V2}',
        asset_base_url: '${public_env[environment].asset_base_url}',
        job_base_url: '${public_env[environment].job_base_url}',
        job_base_url_V2: '${public_env[environment].job_base_url_V2}',
        job_interaction_base_url_V2: '${public_env[environment].job_interaction_base_url_V2}',
        job_interaction_base_url_V1: '${public_env[environment].job_interaction_base_url_V1}',
        assessment_base_url: '${public_env[environment].assessment_base_url}',
        job_interaction_base_url: '${public_env[environment].job_interaction_base_url}',
        team_management_base_url: '${public_env[environment].team_management_base_url}',
        orchestrator_base_url: '${public_env[environment].orchestrator_base_url}',
        frontend_url: '${public_env[environment].frontend_url}',
        test_url_for_ai_interview: '${public_env[environment].test_url_for_ai_interview}',
        socket_ai_interview:'${public_env[environment].socket_ai_interview}',
        socket_base_url: '${public_env[environment].socket_base_url}',
        authorization:'${public_env[environment].authorization}',
        LINKEDIN_SIGNUP_REDIRECT_URL: 'auth/signup',
        LINKEDIN_LOGIN_REDIRECT_URL: 'auth/login',
        job_base_url1:'${public_env[environment].job_base_url1}',
        developer_base_url_recruiter: '${public_env[environment].developer_base_url_recruiter}',
        accessKeyId:'${public_env[environment].accessKeyId} ',
        secretAccessKey:'${public_env[environment].secretAccessKey}' ,
        aws: {
            clientId:'${public_env[environment].accessKeyId} ',
            secretKey:'${public_env[environment].secretAccessKey}',
            region: 'YOUR_REGION'
          },
        ss_ai: '${public_env[environment].ss_ai}',
        localhostBacked: '${public_env[environment].localhostBacked}',


        
    };
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => {
    if (err) {
        console.log(err);
    }
});