pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        CI = 'true'
    }

    stages {
        

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Ganesh509/WebdriverIO_BDD.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Headless Tests') {
            steps {
                sh '''
                export HEADLESS=true
                rm -rf allure-results
                mkdir -p allure-results
                npm test
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }
    }

    post {

        always {
            echo 'Pipeline completed.'
        }

        success {
            echo 'Build SUCCESS ✅'
        }

        failure {
            echo 'Build FAILED ❌'
        }

        unstable {
            echo 'Build UNSTABLE ⚠️'
        }

        cleanup {
            cleanWs()
        }
    }
}
