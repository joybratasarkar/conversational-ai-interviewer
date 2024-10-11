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

        test_url_for_ai_interview: '${public_env[environment].test_url_for_ai_interview}',
        socket_ai_interview:'${public_env[environment].socket_ai_interview}',



        
    };
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: any) => {
    if (err) {
        console.log(err);
    }
});