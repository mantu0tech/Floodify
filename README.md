# Floodify – Real-Time Flood Monitoring & Safety Platform

## Project Overview

Floodify is a flood monitoring and safety platform designed to help users monitor flood-affected areas, report incidents, and locate nearby shelters and hospitals.

This project also demonstrates the deployment of a full-stack application on **Amazon Web Services (AWS)** using Amazon EC2 and Amazon RDS.

The application frontend and backend are hosted on an Ubuntu EC2 instance, while the MySQL database is hosted separately on Amazon RDS.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3, Axios, React Router |
| Backend | Java, Spring Boot, Maven |
| Database | MySQL, Amazon RDS |
| Cloud Infrastructure | AWS EC2, AWS VPC, AWS RDS |
| Operating System | Ubuntu Server |
| Tools | Git, GitHub, Docker, Jenkins |

## Application Architecture

```text
                  Users
                    |
                    v
             React Frontend
               (Port 3000)
                    |
                    v
          Spring Boot Backend
             (AWS EC2)
                    |
                    v
             MySQL Database
              (Amazon RDS)
```

### Detailed AWS Architecture

For a detailed view of the AWS infrastructure and application deployment flow, refer to the architecture documentation:

[View AWS Architecture Diagram](docs/architecture/aws-architecture.md)

### AWS Infrastructure

The application was deployed using the following AWS services:

- **Amazon VPC:** Provides the networking environment for EC2 and RDS.
- **Amazon EC2:** Hosts the React frontend and Spring Boot backend on an Ubuntu server.
- **Amazon RDS:** Hosts the MySQL relational database.
- **Security Groups:** Control network access and allow the EC2 instance to communicate with RDS.

## AWS Deployment Implementation

The Floodify application was deployed on AWS using the following workflow.

### Step 1: Create an AWS VPC

- Created a custom VPC for the application infrastructure.
- Configured public and private subnets across two Availability Zones.
- Configured route tables and an Internet Gateway.
- Enabled DNS hostnames and DNS resolution.

### Step 2: Create an Amazon RDS Database

- Created a MySQL database using Amazon RDS.
- Configured the database username and password.
- Waited until the database status became Available.

### Step 3: Launch an Ubuntu EC2 Instance

- Launched an Ubuntu EC2 instance.
- Configured the instance within the created VPC.
- Enabled a public IP address.
- Configured SSH access.
- Configured HTTP access as required for frontend access.

### Step 4: Configure Security Groups

- Identified the security group associated with the RDS database.
- Configured an inbound rule to allow MySQL traffic on port 3306.
- Restricted database access to the EC2 security group.

### Step 5: Install Required Software on EC2

Installed the required dependencies on the Ubuntu EC2 instance:

- Node.js
- npm
- OpenJDK 21
- Maven
- MySQL client

### Step 6: Clone the Application Repository

Cloned the Floodify GitHub repository and switched to the required deployment branch.

```bash
git clone https://github.com/mantu0tech/Floodify
cd Floodify/
git checkout design
```

### Step 7: Connect EC2 to Amazon RDS

- Verified that the RDS database was Available.
- Used the RDS endpoint, port 3306, database username, and password to establish a MySQL connection from EC2.
- Verified successful database connectivity.

### Step 8: Create and Import the Database

- Connected to the MySQL database hosted on RDS.
- Created the required database.
- Prepared the database structure and data required by the application.

### Step 9: Configure Spring Boot Database Connectivity

Updated the Spring Boot database configuration in:

```text
floodify_backend/src/main/resources/application.properties
```

Configured the MySQL connection using the Amazon RDS endpoint, database name, username, and password.

### Step 10: Build and Run the Spring Boot Backend

Navigated to the backend directory and built the application using Maven.

```bash
cd floodify_backend/
mvn clean install
```

Started the generated Spring Boot JAR file:

```bash
java -jar target/floodify_backend-0.0.1-SNAPSHOT.jar
```

Verified that the backend application started successfully.

### Step 11: Run and Verify the React Frontend

Opened another terminal session on the EC2 instance.

Started the React frontend:

```bash
npm start
```

Configured the EC2 security group to allow inbound traffic on port 3000.

Accessed the application using the EC2 public IPv4 address:

```text
http://<EC2-PUBLIC-IP>:3000/
```

Verified that the frontend was accessible and could communicate with the backend.

### Step 12: AWS Resource Cleanup

After completing the deployment practice, stopped or deleted AWS resources that were no longer required to avoid unnecessary charges.

## Deployment Documentation

The detailed deployment guide is available here:

[**Floodify AWS EC2 and RDS Deployment Guide**](docs/deployment/Floodify-AWS-EC2-RDS-Deployment.pdf)

The guide includes AWS console configuration, deployment commands, database connectivity steps, and screenshots.

## Running the Project Locally

### Frontend

```bash
npm install
npm start
```

### Backend

```bash
cd floodify_backend
mvn clean install
```

Run the generated Spring Boot JAR using the appropriate application configuration.

Ensure that the required MySQL database configuration is provided before starting the backend.

## Repository Structure

```text
Floodify/
│
├── src/                         # React frontend source code
├── public/                      # Static frontend assets
│
├── floodify_backend/             # Spring Boot backend
│
├── docs/
│   ├── deployment/
│   │   └── Floodify-AWS-EC2-RDS-Deployment.pdf
│   │
│   └── architecture/
│       └── aws-architecture.md
│
├── package.json
├── README.md
└── .gitignore
```

## Security Considerations

- Do not commit AWS access keys, private keys, or database passwords.
- Keep database credentials outside publicly accessible source code.
- Restrict RDS inbound access to the required