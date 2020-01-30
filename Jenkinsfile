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
        sh 'npm run build'
      }
    }
    stage('lint') {
      steps {
        echo 'Running linter'
        sh 'npm run lint'
      }
    }
    stage('test') {
      steps {
        echo 'Running cypress'
        sh 'npm run test:ci'
      }
    }
    stage('release') {
      when { branch 'sam-jenkins' }
      steps {
        echo 'Releasing package'
        sh 'git checkout sam-jenkins'
        sh 'npm version minor'
        sh 'npm run build'
        sh 'git add -f dist'
        sh 'git commit --amend --no-edit'
        sh 'git push --force-with-lease origin sam-jenkins'
      }
    }
  }
}
