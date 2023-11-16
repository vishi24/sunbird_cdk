import * as cdk from "aws-cdk-lib";
import * as helm from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { ConfigProps } from "./config";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as childProcess from "child_process";

export interface testStackProps extends cdk.StackProps {
  config: ConfigProps;
  rdssecret: string;
  rdsHost: string;
}

export class testStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: testStackProps) {
    super(scope, id, props);

    const rdssecretARN = props.rdssecret;
    const appSecret = Secret.fromSecretCompleteArn(
      this,
      "rdssecret",
      rdssecretARN
    );
    const user = appSecret.secretValueFromJson("username").toString();
    const base64encodedpass = cdk.Fn.base64(
      appSecret.secretValueFromJson("password").unsafeUnwrap.toString()
    );

    const useriam = new iam.User(this, "sbrc-minios", {
      userName: "sbrc-minios", // Replace with your desired username
    });
    useriam.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );

    const accessKey = new iam.CfnAccessKey(this, "MyAccessKey", {
      userName: useriam.userName,
    });

    const encodedAccessKey = cdk.Fn.base64(
      accessKey.attrSecretAccessKey.toString()
    );
    const encodedSecretKey = cdk.Fn.base64(accessKey.ref);
    const chart = props.config.CHART;
    const repository = props.config.REPOSITORY;
    const namespace = props.config.NAMESPACE;
    const release = props.config.RELEASE;
    const rdsHost = props.rdsHost;
    console.log("rdssecretARN -", rdssecretARN);
    console.log("appSecret -", appSecret);
    console.log("RDS USER -", user);
    console.log("base64encodedpass - ", base64encodedpass);
    console.log("s3 USer -", useriam);
    console.log("s3 Key -", accessKey);
    console.log("s3 EncodedKey -", encodedAccessKey);
    console.log("s3 EncodedKey Secret -", encodedSecretKey);
  }
}
