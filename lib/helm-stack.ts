import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as helm from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sm from "aws-cdk-lib/aws-secretsmanager";
import { ISecret, Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { ConfigProps } from "./config";

export interface helmStackProps extends cdk.StackProps {
  config: ConfigProps;
  vpc: ec2.Vpc;
  rdssecret: string;
  eksCluster: eks.FargateCluster;
  s3bucket: s3.Bucket;
  rdsHost: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  KEYCLOAK_DEFAULT_USER_PASSWORD: string;
  RDS_PASSWORD: string;
  MINIO_USER: string;
}

export class helmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: helmStackProps) {
    super(scope, id, props);
    const vpc = props.vpc;
    const eksCluster = props.eksCluster;
    const rdssecretARN = props.rdssecret;
    const bucketName = props.s3bucket.bucketName;
    const KEYCLOAK_ADMIN_CLIENT_SECRET = props.KEYCLOAK_ADMIN_CLIENT_SECRET;
    const KEYCLOAK_ADMIN_PASSWORD = props.KEYCLOAK_ADMIN_PASSWORD;
    const KEYCLOAK_DEFAULT_USER_PASSWORD = props.KEYCLOAK_DEFAULT_USER_PASSWORD;
    const RDS_PASSWORD = props.RDS_PASSWORD;
    const MINIO_USER = props.MINIO_USER;

    const secretName = sm.Secret.fromSecretAttributes(this, "ImportedSecret", {
      secretCompleteArn: rdssecretARN,
    });
    const getValueFromSecret = (secret: ISecret, key: string): string => {
      return secret.secretValueFromJson(key).unsafeUnwrap();
    };
    const dbPass = getValueFromSecret(secretName, "password");

    const base64encodedDBpass = cdk.Fn.base64(RDS_PASSWORD);
    const base64encodedkeycloakAdminPassword = cdk.Fn.base64(KEYCLOAK_ADMIN_PASSWORD);
    const base64encodedkeycloakUserPassword = cdk.Fn.base64(KEYCLOAK_DEFAULT_USER_PASSWORD);

    const useriam = new iam.User(this, "MyUser", {
      userName: MINIO_USER,
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
            DB_PASSWORD: base64encodedDBpass,
            // ELASTIC_SEARCH_PASSWORD: ELASTIC_SEARCH_PASSWORD,
            KEYCLOAK_ADMIN_CLIENT_SECRET: KEYCLOAK_ADMIN_CLIENT_SECRET,
            KEYCLOAK_ADMIN_PASSWORD: base64encodedkeycloakAdminPassword,
            KEYCLOAK_DEFAULT_USER_PASSWORD: base64encodedkeycloakUserPassword,
            MINIO_SECRET_KEY: encodedSecretKey,
            access_key: encodedAccessKey,
          },
          minio: {
            bucket_key: bucketName,
            access_key: encodedAccessKey,
          },
        },
      },
    });

    new cdk.CfnOutput(this, "DB Password", {
      value: dbPass,
    });
  }
}
