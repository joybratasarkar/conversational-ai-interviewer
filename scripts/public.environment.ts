const PUBLIC_ENV_VARIABLES = {
    "development": {

        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://ai-inteview.onrender.com',
        socket_base_url:'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        job_base_url1:'https://dev-api.supersourcing.com/job-management-service/api/v1/',


    },
    "testing": {

        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://ai-inteview.onrender.com',
        socket_base_url:'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        job_base_url1:'https://dev-api.supersourcing.com/job-management-service/api/v1/',



    },
    "production": {











        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://ai-inteview.onrender.com',
        socket_base_url:'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        job_base_url1:'https://dev-api.supersourcing.com/job-management-service/api/v1/',


    }
};

module.exports = PUBLIC_ENV_VARIABLES;
