pipeline {

    agent any

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main',
                url: 'https://github.com/anmolp928/CloudOps-task-manager.git'
            }
        }


        stage('Verify Files') {

            steps {

                sh 'ls -la'
                sh 'ls frontend'
                sh 'ls backend'
            }
        }


        stage('Deploy to Kubernetes') {

            steps {

                sh 'echo Kubernetes deployment stage ready'
            }
        }
    }
}