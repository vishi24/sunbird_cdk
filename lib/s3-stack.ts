import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { ConfigProps } from "./config";
import { Stack, StackProps } from "aws-cdk-lib";

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

    this.s3bucket = new s3.Bucket(this, "MyBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: bucketName,
    });
  }
}
