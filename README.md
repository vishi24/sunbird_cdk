# Sunbird RC, one-click deployment on AWS

### Description
Sunbird RC is an interoperable and unified registry infrastructure that needs to be established to enable "live," "reusable," and "trustworthy" registries as a "single source of truth" to address the three core issues mentioned. To learn more about Sunbird RC, please visit [https://docs.sunbirdrc.dev/](https://docs.sunbirdrc.dev/).

### Packaging overview
This packaging initiative offers a practical approach to increase the adoption, streamline deployment and management of Sunbird RC building blocks on AWS by providing a reference architecture and one-click deployment automation scripts. It allows builders to manage AWS resource provisioning and application deployment in a programmatic and repeatable way.

This repository contains the source code and configuration for deploying Sunbird RC stack that leverages the power of Amazon Web Services (AWS) **[Cloud Development Kit (CDK)](https://aws.amazon.com/cdk)** for infrastructure provisioning and **[Helm](https://helm.sh)** for deploying services within an Amazon Elastic Kubernetes Service (EKS) cluster.  

### SunBird RC Deployment
The Sunbird RC one-click deployment packaging offers two mode of deployments on the AWS cloud, catering to different deployment scenarios.

#### Mode One: AWS CDK + Helm
This mode offers a comprehensive solution for users who prefer a one-click deployment approach to provisioning AWS infrastructure and deploying the Sunbird RC application stack.

* [AWS CDK One Click Deployment](documentation/01-Deployment-CDK-Sunbird.md)

#### Mode Two: Direct Helm Chart Invocation
An alternative deployment approach accommodates users with existing essential AWS infrastructure components like Amazon RDS Postgres and an Amazon EKS cluster. This mode enables the direct installation of the Sunbird RC Helm chart without relying on AWS CDK scripts. Alternatively, you can combine both methods, utilizing CDK for provisioning specific services like the EKS cluster.

* [Helm Chart Deployment](documentation/02-Deployment-Helm-Sunbird.md)

### Sunbird RC reference architecture
Required AWS services to operate the core Sunbird RC registry services:
* Amazon VPC
* Amazon RDS for PostgreSQL Serverless V2
* Amazon Elastic Kubernetes Service (Amazon EKS)
* AWS Fargate
* Amazon S3
* Elastic Load Balancing (ELB)
* Amazon API Gateway

Auxiliary components (ideal for production-grade deployments):
* Amazon ElastiCache Redis Engine
* Amazon OpenSearch Elasticsearch 
* Amazon MSK

![Architecture](documentation/Sunbird-RC-AWS-Reference-Architecture.jpg)