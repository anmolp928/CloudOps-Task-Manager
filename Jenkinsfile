pipeline {

    agent any

    environment {

        FRONTEND_IMAGE = "anmolp20/cloudops-frontend:latest"
        BACKEND_IMAGE = "anmolp20/cloudops-backend:latest"
    }

    stages {

        stage('Clone Repository') {

            steps {
                git branch: 'main', url: 'https://github.com/anmolp928/CloudOps-task-manager.git'
            }
        }


        stage('Build Frontend Image') {

            steps {

                dir('frontend') {

                    bat 'docker build -t %FRONTEND_IMAGE% .'
                }
            }
        }


        stage('Build Backend Image') {

            steps {

                dir('backend') {

                    bat 'docker build -t %BACKEND_IMAGE% .'
                }
            }
        }


        stage('Push Frontend Image') {

            steps {

                bat 'docker push %FRONTEND_IMAGE%'
            }
        }


        stage('Push Backend Image') {

            steps {

                bat 'docker push %BACKEND_IMAGE%'
            }
        }


        stage('Deploy to Kubernetes') {

            steps {

                bat 'kubectl apply -f k8s/'
            }
        }
    }
}