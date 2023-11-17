import * as cdk from "aws-cdk-lib";
import * as helm from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { ConfigProps } from "./config";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
// import * as childProcess from "child_process";
// import * as secmanager from "aws-sdk/client-secrets-manager";
import { exec } from "child_process";
import * as AWS from "aws-sdk";

export interface helmStackProps extends cdk.StackProps {
  config: ConfigProps;
  vpc: ec2.Vpc;
  rdssecret: string;
  eksCluster: eks.FargateCluster;
  s3bucket: s3.Bucket;
  rdsHost: string;
}

export class helmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: helmStackProps) {
    super(scope, id, props);
    const vpc = props.vpc;
    const eksCluster = props.eksCluster;
    const rdssecretARN = props.rdssecret;
    const bucketName = props.s3bucket.bucketName;

    //--------Test code
    const awsCliCommand =
      // "aws secretsmanager get-secret-value --secret-id AuroraSecret41E6E877-oOLpuolyaJ4n --query SecretString|jq -r 'fromjson | .password'";
      "aws secretsmanager get-secret-value --secret-id AuroraSecret41E6E877-oOLpuolyaJ4n --query SecretString --no-verify-ssl";

    // Execute AWS CLI command

    const getPassword = exec(awsCliCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      } else {
        return stdout;
      }
    });

    //--------Test code

    const appSecret = Secret.fromSecretCompleteArn(
      this,
      "rdssecret",
      rdssecretARN
    );
    const user = appSecret.secretValueFromJson("username").toString();
    const base64encodedDBpass = cdk.Fn.base64(
      appSecret.secretValueFromJson("password").unsafeUnwrap.toString()
    );

    const useriam = new iam.User(this, "MyUser", {
      userName: "sbrc-miniosnew", // Replace with your desired username
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

    //---------------------------------
    // async function retrieveSecret() {
    //   const client = new SecretsManagerClient({ region: "your-region" });
    //   const command = new GetSecretValueCommand({ SecretId: "MySecretName" });

    //   try {
    //     const response = await client.send(command);

    //     // Check if the secret has a string value
    //     if ("SecretString" in response) {
    //       const secretValue = response.SecretString;

    //       // Do something with the secret value
    //       console.log("Secret Value:", secretValue);
    //     } else {
    //       console.error("Error: Secret does not have a string value.");
    //     }
    //   } catch (error) {
    //     console.error("Error retrieving secret:", error);
    //   }
    // }
    //--------------------------------

    new helm.HelmChart(this, "cdkhelm", {
      cluster: eksCluster,
      chart: chart,
      repository: repository,
      namespace: namespace,
      release: release,
      values: {
        global: {
          database: {
            host: rdsHost,
          },
          kafka: {
            url: "kafka.sbrc.com:9098",
          },
          redis: {
            host: "redis.sbrc.com",
          },
          elastic_search: {
            url: "es.sbrc.com",
          },
          secrets: {
            // DB_PASSWORD: base64encodedDBpass,
            DB_PASSWORD: "SkVFWFVmS0pqLTZhcHZTaHVXNy5HT15oX1o5VFgu",
            ELASTIC_SEARCH_PASSWORD: "T3BlbnNlYXJjaEAxMjMK",
            KEYCLOAK_ADMIN_CLIENT_SECRET:
              "YzllOTA1YTQtOWIyZi00NWU2LThlMDUtMTNjM2E5NTNmNjUx",
            KEYCLOAK_ADMIN_PASSWORD: "YWRtaW4xMjM=",
            MINIO_SECRET_KEY: encodedSecretKey,
            KEYCLOAK_DEFAULT_USER_PASSWORD: "YWRtaW5AMTIz",
            access_key: encodedAccessKey,
          },
          minio: {
            bucket_key: bucketName,
            access_key: encodedAccessKey,
          },
        },
      },
    });
    const DBpass = getPassword.stdout?.read.toString;
    console.log("DB oasswprd extracted", DBpass);
    // new cdk.CfnOutput(this, "DB User name", {
    //   value: DBpass,
    // });
  }
}
