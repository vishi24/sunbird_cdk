import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { GatewayVpcEndpointAwsService } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { ConfigProps } from "./config";

type AwsEnvStackProps = StackProps & {
  config: Readonly<ConfigProps>;
};

export class vpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;
    const cidr = config.CIDR;
    const MAX_AZS = config.MAX_AZS;

    this.vpc = new ec2.Vpc(this, "sbrc", {
      maxAzs: MAX_AZS,
      cidr: cidr,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public-",
          subnetType: ec2.SubnetType.PUBLIC,
        },

        {
          cidrMask: 24,
          name: "app-pvt-",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },

        {
          cidrMask: 24,
          name: "db-pvt-",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],

      gatewayEndpoints: {
        S3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
      },
    });
  }
}
