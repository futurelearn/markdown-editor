@Library('futurelearn') _

pipeline {
  agent {
    // this image provides everything needed to run Cypress
    docker {
      image 'cypress/base:10'
    }
  }
  environment {
    CI = 'true'
    HOME = "${env.WORKSPACE}"
  }
  stages {
    // first stage installs node dependencies and Cypress binary
    stage('build') {
      steps {
        // there a few default environment variables on Jenkins
        // on local Jenkins machine (assuming port 8080) see
        // http://localhost:8080/pipeline-syntax/globals#env
        echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
        sh 'npm ci'
      }
    }
    stage('test') {
      steps {
        echo "Running cypress"
        sh 'npm run test:ci'
      }
    }
    stage('release') {
      steps {
        echo "Releasing package"
        sh 'npm run build'
        sh 'git add -f dist'
        sh 'git commit -m "prepare release"'
        sh 'npm version minor'
        sh 'git show'
        sh 'git branch'
        sh 'git remote -v'
      }
    }
  }
}
