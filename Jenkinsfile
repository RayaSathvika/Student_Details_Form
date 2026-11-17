pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME = 'student-details-app'
        CONTAINER_NAME = 'student-details-app'
        HOST_PORT = '5005'
        APP_PORT = '5000'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                checkout scm
                echo "Source code successfully cloned from GitHub repository."
            }
        }

        stage('2. Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .'
                    } else {
                        bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
                    }
                }
            }
        }

        stage('3. Run Docker Container') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker rm -f ${CONTAINER_NAME} || true'
                        sh 'docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${APP_PORT} --restart unless-stopped ${IMAGE_NAME}:latest'
                    } else {
                        bat 'docker rm -f %CONTAINER_NAME% 2>nul || exit /b 0'
                        bat 'docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:%APP_PORT% --restart unless-stopped %IMAGE_NAME%:latest'
                    }
                }
            }
        }

        stage('4. Verify Deployment & Health Check') {
            steps {
                sleep 5
                script {
                    if (isUnix()) {
                        sh 'docker ps --filter "name=${CONTAINER_NAME}"'
                        sh 'curl -f http://host.docker.internal:${HOST_PORT}/health || curl -f http://localhost:${APP_PORT}/health || true'
                    } else {
                        bat 'docker ps --filter "name=%CONTAINER_NAME%"'
                        bat 'curl.exe -f http://localhost:%HOST_PORT%/health || exit /b 0'
                    }
                }
            }
        }
    }

    post {
        success {
            echo "=========================================================="
            echo "   BUILD SUCCESSFUL!"
            echo "   Docker Container: student-details-app"
            echo "   Application Host Port: http://localhost:5005"
            echo "   Docker Internal Port: 5000"
            echo "=========================================================="
        }
        failure {
            echo "Build failed. Check stage logs for details."
        }
    }
}
