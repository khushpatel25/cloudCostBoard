# 🌩️ cloudCostBoard 🌩️

## Overview

cloudCostBoard is a comprehensive AWS cost management dashboard designed to help users efficiently monitor and manage their AWS account costs. With filtering options, cost visualization, report generation, and secure credential management, cloudCostBoard provides a seamless and user-friendly experience for AWS cost management.

## Features

- **Advanced Filtering**: Get precise cost insights by filtering data by date range, service, region, or account.
- **Cost Visualization**: View cost trends over time through intuitive graphs to analyze and understand spending patterns.
- **Report Generation**: Generate detailed reports by applying filters. Users can enter their email address to receive a report URL via email.
- **Secure AWS Credential Management**: AWS credentials are securely stored using AWS Secrets Manager, ensuring data protection and privacy.
- **Enhanced Security**: Secure transmission of AWS credentials between frontend and backend using CryptoJS for encryption.

## Technologies Used

- **Frontend**: Deployed as a Docker container on AWS EC2, built with React.js.
- **Backend**: Entirely serverless, powered by AWS Lambda, with API Gateway handling routing.
- **Storage**: Reports are stored in Amazon S3, with AWS SNS used for sending presigned URLs.
- **Security**: AWS Secrets Manager for securely storing AWS credentials and CryptoJS for encrypted data transmission.

## Architecture

The cloudCostBoard architecture is fully serverless, ensuring scalability and efficiency. The frontend is deployed as a Docker image on EC2, while backend operations are managed through AWS Lambda functions. API Gateway serves as the bridge between the frontend and backend. Reports are generated and stored in S3, with notifications sent via SNS, allowing users to easily access their data.

![cloudCostBoard Architecture](assets/architecture.png)

![cloudCostBoard connectPage](assets/connect.png)

![cloudCostBoard dashboardPage1](assets/dashboard1.png)

![cloudCostBoard dashboardPage2](assets/dashboard2.png)

![cloudCostBoard dashboardPage3](assets/dashboard3.png)

![cloudCostBoard dashboardPage4](assets/dashboard4.png)

![cloudCostBoard generateReportPage](assets/generateReport.png)






