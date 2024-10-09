const PUBLIC_ENV_VARIABLES = {
    "development": {
        session_base_url : 'https://dev-api.supersourcing.com/user-management-service/api/v1/',
        developer_base_url: 'https://dev-api.supersourcing.com/user-management-service/api/v1/engineers/',
        developer_base_url_V2: 'https://dev-api.supersourcing.com/user-management-service/api/v2/engineers/',
        asset_base_url: 'https://dev-api.supersourcing.com/asset-management-service/api/v1/',
        job_base_url: 'https://dev-api.supersourcing.com/job-management-service/api/v1/projects/',
        job_base_url1:'https://dev-api.supersourcing.com/job-management-service/api/v1/',
        job_base_url_V2: 'https://dev-api.supersourcing.com/job-management-service/api/v1/projects-v2/',
        assessment_base_url: 'https://wew2zi268c.execute-api.ap-south-1.amazonaws.com/dev/api/v1/assessment/',
        job_interaction_base_url: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/job-interaction/',
        job_interaction_base_url_V2: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/job-interaction-v2/',
        job_interaction_base_url_V1: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/',
        team_management_base_url: 'https://zysej6a6hf.execute-api.ap-south-1.amazonaws.com/dev/api/v1/',
        orchestrator_base_url: 'https://5esvyzy70f.execute-api.ap-south-1.amazonaws.com/dev/api/v1/',
        frontend_url: 'http://localhost:4200/',
        job_interaction_base_url_interview:'https://dev-api.supersourcing.com/job-interaction-service/api/v1/interview/',
        socket_base_url:'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        authorization:'e6da6e2959334bd4b82390e34e49a93b',
        developer_base_url_recruiter:'https://dev-api.supersourcing.com/user-management-service/api/v1/recruiter/',
        accessKeyId:'AKIAQPB36OTHTT2WS3XP',
        secretAccessKey:'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',
        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://34.67.220.103:8000/',
        ss_ai:'https://dev-api.supersourcing.com/ss-ai/api/v1/',
        localhostBacked:'http://192.168.1.229:3000/api/v1/'
    },
    "testing": {
        job_base_url1:'https://staging-api.supersourcing.com/job-management-service/api/v1/',
        session_base_url : 'https://staging-api.supersourcing.com/user-management-service/api/v1/',
        developer_base_url: 'https://staging-api.supersourcing.com/user-management-service/api/v1/engineers/',
        developer_base_url_V2: 'https://staging-api.supersourcing.com/user-management-service/api/v2/engineers/',
        asset_base_url: 'https://staging-api.supersourcing.com/asset-management-service/api/v1/',
        job_base_url: 'https://staging-api.supersourcing.com/job-management-service/api/v1/projects/',
        job_base_url_V2: 'https://staging-api.supersourcing.com/job-management-service/api/v1/projects-v2/',
        assessment_base_url: 'https://hbhc2zos61.execute-api.ap-south-1.amazonaws.com/prod/api/v1/assessment/',
        job_interaction_base_url: 'https://staging-api.supersourcing.com/job-interaction-service/api/v1/job-interaction/',
        job_interaction_base_url_V2: 'https://staging-api.supersourcing.com/job-interaction-service/api/v1/job-interaction-v2/',
        job_interaction_base_url_V1: 'https://astaging-api.supersourcing.com/job-interaction-service/api/v1/',
        team_management_base_url: 'https://staging-api.supersourcing.com.ap-south-1.amazonaws.com/prod/api/v1/',
        orchestrator_base_url: 'https://h6ofatpatc.execute-api.ap-south-1.amazonaws.com/prod/api/v1/',
        frontend_url: 'https://developers.supersourcing.com/',
        job_interaction_base_url_interview:'https://staging-api.supersourcing.com/job-interaction-service/api/v1/interview/',
        socket_base_url: 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        authorization:'e6da6e2959334bd4b82390e34e49a93b',
        developer_base_url_recruiter:'https://staging-api.supersourcing.com/user-management-service/api/v1/recruiter/',
        accessKeyId:'AKIAQPB36OTHTT2WS3XP',
        secretAccessKey:'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',
        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://34.67.220.103:8000/',
        ss_ai:'https://staging-api.supersourcing.com/ss-ai/api/v1/',
        // ss_ai:'https://dev-api.supersourcing.com/ss-ai/api/v1/',

        localhostBacked:'http://192.168.1.229:3000/api/v1/'

    },
    "production": {
        // job_base_url1:'https://api.supersourcing.com/job-management-service/api/v1/',
        // session_base_url : 'https://api.supersourcing.com/user-management-service/api/v1/',
        // developer_base_url: 'https://api.supersourcing.com/user-management-service/api/v1/engineers/',
        // developer_base_url_V2: 'https://api.supersourcing.com/user-management-service/api/v2/engineers/',
        // asset_base_url: 'https://api.supersourcing.com/asset-management-service/api/v1/',
        // job_base_url: 'https://api.supersourcing.com/job-management-service/api/v1/projects/',
        // job_base_url_V2: 'https://api.supersourcing.com/job-management-service/api/v1/projects-v2/',
        // assessment_base_url: 'https://hbhc2zos61.execute-api.ap-south-1.amazonaws.com/prod/api/v1/assessment/',
        // job_interaction_base_url: 'https://api.supersourcing.com/job-interaction-service/api/v1/job-interaction/',
        // job_interaction_base_url_V2: 'https://api.supersourcing.com/job-interaction-service/api/v1/job-interaction-v2/',
        // job_interaction_base_url_V1: 'https://api.supersourcing.com/job-interaction-service/api/v1/',
        // team_management_base_url: 'https://jl5040d0kg.execute-api.ap-south-1.amazonaws.com/prod/api/v1/',
        // orchestrator_base_url: 'https://h6ofatpatc.execute-api.ap-south-1.amazonaws.com/prod/api/v1/',
        // frontend_url: 'https://developers.supersourcing.com/',
        // job_interaction_base_url_interview:'https://api.supersourcing.com/job-interaction-service/api/v1/interview/',
        // socket_base_url: 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        // authorization:'e6da6e2959334bd4b82390e34e49a93b',
        // developer_base_url_recruiter:'https://api.supersourcing.com/user-management-service/api/v1/recruiter/',
        // accessKeyId:'AKIAQPB36OTHTT2WS3XP',
        // secretAccessKey:'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',
        // test_url_for_ai_interview:'http://127.0.0.1:8000/',
        // socket_ai_interview:'https://staging-api.supersourcing.com/ai-interviewer/',
        // ss_ai:'https://api.supersourcing.com/ss-ai/api/v1/',
        // localhostBacked:'http://192.168.1.229:3000/api/v1/'










        session_base_url : 'https://dev-api.supersourcing.com/user-management-service/api/v1/',
        developer_base_url: 'https://dev-api.supersourcing.com/user-management-service/api/v1/engineers/',
        developer_base_url_V2: 'https://dev-api.supersourcing.com/user-management-service/api/v2/engineers/',
        asset_base_url: 'https://dev-api.supersourcing.com/asset-management-service/api/v1/',
        job_base_url: 'https://dev-api.supersourcing.com/job-management-service/api/v1/projects/',
        job_base_url1:'https://dev-api.supersourcing.com/job-management-service/api/v1/',
        job_base_url_V2: 'https://dev-api.supersourcing.com/job-management-service/api/v1/projects-v2/',
        assessment_base_url: 'https://wew2zi268c.execute-api.ap-south-1.amazonaws.com/dev/api/v1/assessment/',
        job_interaction_base_url: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/job-interaction/',
        job_interaction_base_url_V2: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/job-interaction-v2/',
        job_interaction_base_url_V1: 'https://dev-api.supersourcing.com/job-interaction-service/api/v1/',
        team_management_base_url: 'https://zysej6a6hf.execute-api.ap-south-1.amazonaws.com/dev/api/v1/',
        orchestrator_base_url: 'https://5esvyzy70f.execute-api.ap-south-1.amazonaws.com/dev/api/v1/',
        frontend_url: 'http://localhost:4200/',
        job_interaction_base_url_interview:'https://dev-api.supersourcing.com/job-interaction-service/api/v1/interview/',
        socket_base_url:'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000',
        authorization:'e6da6e2959334bd4b82390e34e49a93b',
        developer_base_url_recruiter:'https://dev-api.supersourcing.com/user-management-service/api/v1/recruiter/',
        accessKeyId:'AKIAQPB36OTHTT2WS3XP',
        secretAccessKey:'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',
        test_url_for_ai_interview:'http://127.0.0.1:8000/',
        socket_ai_interview:'https://34.67.220.103:8000/',
        ss_ai:'https://dev-api.supersourcing.com/ss-ai/api/v1/',
        localhostBacked:'http://192.168.1.229:3000/api/v1/'

    }
};

module.exports = PUBLIC_ENV_VARIABLES;
