import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ConfigProps } from "./config";
import { Stack, StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";

import {
  GatewayVpcEndpointAwsService,
  Vpc,
  FlowLogTrafficType,
  FlowLogDestination,
  InterfaceVpcEndpoint,
} from "aws-cdk-lib/aws-ec2";

import { SubnetGroup } from "aws-cdk-lib/aws-rds";
type AwsEnvStackProps = StackProps & {
  config: Readonly<ConfigProps>;
};
export interface bucketStackProps extends cdk.StackProps {
  config: ConfigProps;
}
export class s3Stack extends cdk.Stack {
  public readonly s3bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;
    const bucketName = config.BUCKET_NAME;

    // Output the User ARN
    // const userArnOutput = new cdk.CfnOutput(this, "UserArn", {
    //   description: "IAM User ARN",
    //   value: user.userArn,
    //   exportName: `${cdk.Aws.STACK_NAME}-UserArn`,
    // });

    this.s3bucket = new s3.Bucket(this, "MyBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: bucketName,
    });

    // const putStatement = new iam.PolicyStatement({
    //   actions: ["s3:PutObject"],
    //   resources: [`${this.myBucket.bucketArn}/*`],
    // });

    // const denyDeleteStatement = new iam.PolicyStatement({
    //   actions: ["s3:DeleteObject"],
    //   resources: [`${this.myBucket.bucketArn}/*`],
    //   effect: iam.Effect.DENY,
    // });

    // const bucketPolicy = new iam.Policy(this, "BucketPolicy", {
    //   statements: [putStatement, denyDeleteStatement],
    // });

    // this.myBucket.grantReadWrite(bucketPolicy);
  }
}
