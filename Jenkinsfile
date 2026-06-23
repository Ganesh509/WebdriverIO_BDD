pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '30'))
    timeout(time: 1, unit: 'HOURS')
    timestamps()
  }

  tools {
    nodejs 'node'
  }

  environment {
    CI = 'true'
    BASE_URL = 'https://practice.saucedemo.com'
    LOG_LEVEL = 'warn'
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/Ganesh509/WebdriverIO_BDD.git']]
        ])
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Code Quality - Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Run Tests - Smoke') {
      steps {
        sh '''
          mkdir -p allure-results
          npm run test:smoke
        '''
      }
    }

    stage('Run Tests - Regression') {
      when {
        branch 'main'
      }
      steps {
        sh '''
          mkdir -p allure-results
          npm test
        '''
      }
    }
  }

  post {
    always {
      echo 'Generating Allure Report...'
      script {
        sh '''
          if [ -d "allure-results" ]; then
            npx allure generate allure-results -o allure-report --clean || true
          fi
        '''
      }

      publishAllure(
        results: [[path: 'allure-results']],
        reportBuildPolicy: 'ALWAYS'
      )

      archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
    }

    success {
      echo '✅ Build SUCCESS'
    }

    failure {
      echo '❌ Build FAILED'
      sh 'echo "Pipeline failed on branch ${GIT_BRANCH}"'
    }

    unstable {
      echo '⚠️  Build UNSTABLE'
    }

    cleanup {
      cleanWs()
    }
  }
}

