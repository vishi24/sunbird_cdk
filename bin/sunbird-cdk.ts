#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { sbrcStack } from "../lib/sbrc-stack";
import { vpcStack } from "../lib/vpc-stack";
import { rdsStack } from "../lib/rds-stack";
import { eksStack } from "../lib/eks-stack";
import { getConfig } from "../lib/config";
import { ConfigProps } from "../lib/config";
import { Stack, StackProps } from "aws-cdk-lib";
import { s3Stack } from "../lib/s3-stack";
import { helmStack } from "../lib/helm-stack";
import { testStack } from "../lib/test-stack";

const config = getConfig();

const app = new cdk.App();
type AwsEnvStackProps = StackProps & {
  config: ConfigProps;
};

const MY_AWS_ENV_STACK_PROPS: AwsEnvStackProps = {
  env: {
    region: "ap-south-1",
    account: "370803901956",
  },
  config: config,
};

const infra = new vpcStack(app, "vpcstack", MY_AWS_ENV_STACK_PROPS);

const s3bucket = new s3Stack(app, "s3stack", MY_AWS_ENV_STACK_PROPS);
// const rdssecret = new rdsStack(app, "rdsstack", MY_AWS_ENV_STACK_PROPS);
const rdssecret = new rdsStack(app, "rdsstack", {
  env: {
    region: "ap-south-1",
    account: "370803901956",
  },
  config: config,
  vpc: infra.vpc,
});
const eksCluster = new eksStack(app, "eksstack", {
  env: {
    region: "ap-south-1",
    account: "370803901956",
  },
  config: config,
  vpc: infra.vpc,
});
new helmStack(app, "helmStack", {
  env: {
    region: "ap-south-1",
    account: "370803901956",
  },
  config: config,
  vpc: infra.vpc,
  rdssecret: rdssecret.rdsSecret,
  eksCluster: eksCluster.eksCluster,
  s3bucket: s3bucket.s3bucket,
  rdsHost: rdssecret.rdsHost,
});
new testStack(app, "testStack", {
  env: {
    region: "ap-south-1",
    account: "370803901956",
  },
  config: config,
  rdssecret: rdssecret.rdsSecret,
  rdsHost: rdssecret.rdsHost,
});
