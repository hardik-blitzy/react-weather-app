pipeline {
    agent none

    stages{
        stage("Test"){
            agent {
                docker {
                    image 'node:lts-alpine'
                }
            }
            steps{
                sh "chmod +x -R ${env.WORKSPACE}"
                sh './scripts/test.sh'
            }
        }
        stage("Security Scan"){
            agent {
                docker {
                    image 'node:lts-alpine'
                }
            }
            steps{
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "npm install --legacy-peer-deps"
                // Run npm audit and fail the build if high-severity vulnerabilities are found
                sh "npm audit --audit-level=high"
            }
        }
        stage("Build"){
            agent {
                docker {
                    image 'node:lts-alpine'
                }
            }
            steps{
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "npm install"
                sh "./scripts/deliver-for-development.sh"
            }
        }
        stage("Deliver for Development"){
            agent any
            when {
                branch "development"
            }
            steps{
                // Removed sudo - proper permissions should be configured on the Jenkins agent
                sh 'rm -rf /var/www/jenkins-weather-app'
                sh "cp -r ${env.WORKSPACE}/build /var/www/jenkins-weather-app"
                sh "ls /var/www/jenkins-weather-app"
                // sh './scripts/kill.sh'
            }
        }
        stage("Deploy for Production"){
            when {
                branch "production"
            }
            steps {
                sh './scripts/deploy-for-production.sh'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './scripts/kill.sh'
            }
        }
    }
}