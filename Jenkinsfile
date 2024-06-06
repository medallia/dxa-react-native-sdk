pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Push to GitHub') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        git branch: 'main',
                            credentialsId: 'credentials-id',
                            url: 'https://github.com/medallia/dxa-react-native-sdk/'
                        sh 'git tag -a test-tag'
                        sh 'git push origin main --tags'
                    }
                }
            }
        }
    }
}