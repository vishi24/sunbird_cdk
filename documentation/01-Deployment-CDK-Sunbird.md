## AWS CDK One Click Deployment ##

## Prerequisties:
To get started with CDK, it's easier to set up an AWS Cloud9 environment, which provides you with a code editor and a terminal that runs in a web browser. Using AWS Cloud9 is optional but highly recommended, as it expedites the process. Alternatively, you can also configure AWS CLI in your local environment or on a remote server of your choice.

#### Create a new AWS Cloud9 environment

1) Navigate to Cloud9 in the [AWS Management Console](https://console.aws.amazon.com/cloud9).
2) Select Create environment.

### AWS CDK Stack Overview
The CDK comprises stacks designed to perform unique provisioning steps, making the overall automation modular. Here is an overview of all the stacks along with the actions they perform:

    bin/sunbird-cdk.ts - Is the entrypoint of the CDK application.
    config.ts  -  Input file for CDK Deployment including defaults ( AWS Account Number, Region, Bucket Name etc., )
    vpc-stack.ts  -  Foundation stack creation including VPC, Subnets, Route tables, NatGW etc.,
    rds-stack.ts  - Creates RDS Aurora Postgresql cluster
    eks-stack.ts  - To create EKS Fargate Cluster
    s3-stack.ts  - Creates S3 bucket (bucket name will be taken from env file)
    helm-stack.ts - To deploy Sunbird RC helm chart

### CDK Stack list
    vpcStack, rdsStack, eksStack, s3Stack, helmStack

### Prepare your environment
```
# Install TypeScript globally for CDK
npm i -g typescript

# Install aws cdk
npm i -g aws-cdk

# Clone the repository 
git clone <repo_url>
cd sunbird-rc-aws-automation

# Install the CDK application
npm i

# cdk bootstrap [aws://ACCOUNT-NUMBER-1/REGION-1]
cdk bootstrap aws://ACCOUNT-NUMBER-1/REGION-1
```

#### Update mandatory environment variables, with your preferred editor open '.env' file

   | Secret Key                                     | Description   | 
   | ---------------------------------------------  | ------- | 
   | REGION                            | XXXXYY  | 
   | ACCOUNT                     | XXXXYY  | 
   | CIDR                      | VPC CIDR, change it as per your environment  | 
   | MAX_AZS                | AWS Availability Zone count, default 2  |
   | BUCKET_NAME                | S3 bucket name for storing registory contents  |
   | RDS_USER                | Database user name for core registory service, default 'postgres'  |
   | RDS_PASSWORD                | Database password, used while DB creation and passed down to Sunbrd RC services helm chart  |
   | KEYCLOAK_ADMIN_PASSWORD                | Keycloak admin password, used during initial UI login  |
   | KEYCLOAK_DEFAULT_USER_PASSWORD                | Keycloak default password to UI login  |

**Deploy CDK**
```
# After updating the env file, run AWS CDK commands to begin with deploy

# emits the synthesized CloudFormation template
cdk synth 

# List CDK stack
cdk list

# Deploy single stack. Ensure order is maintained - vpcStack, rdsStack, eksStack, s3Stack, helmStack
cdk deploy <stack_name>

# Alternatively you could also deploy all stacks and CDK would handle the sequence
cdk deploy --all 
```

After installing all the CDK stacks, verify the AWS services in the AWS web console. The stack 'helmStack' installs the Sunbird RC helm chart and all associated services in the EKS cluster. It is recommended to review the [Deployment through Helm](02-Deployment-Helm-Sunbird.md) guide to become familiar with Helm charts, services, and parameters. This will be beneficial if you opt to run the Helm chart separately from the CDK, following the "Mode Two: Direct Helm Chart Invocation" approach for installing the Sunbird RC stack.

Follow the post installation steps to start using Sunbird RC services

* [Post Installation Procedure](03-Post-Installation-Procedure.md)

**Lastly, if you wish to clean up, run 'AWS CDK destroy' to remove all AWS resources that were created by it.**
```
cdk destroy [STACKS..]
```
