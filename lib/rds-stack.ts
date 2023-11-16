import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as kms from "aws-cdk-lib/aws-kms";
import { ConfigProps } from "./config";
import { Stack, StackProps } from "aws-cdk-lib";
import { vpcStack } from "./vpc-stack";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
type AwsEnvStackProps = StackProps & {
  config: Readonly<ConfigProps>;
};

export interface RdsStackProps extends cdk.StackProps {
  config: ConfigProps;
  vpc: ec2.Vpc;
}

export class rdsStack extends cdk.Stack {
  public readonly rdsSecret: string;
  public readonly rdsHost: string;
  constructor(scope: Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const { config } = props;
    const RDS_SEC_GRP_INGRESS = config.RDS_SEC_GRP_INGRESS;
    const vpc = props.vpc;
    const kmsKey = new kms.Key(this, "RDSKmsKey", {
      enableKeyRotation: true, // Optional: Enable key rotation
    });

    // const vpcId = cdk.Fn.importValue("SB-RCVPC");
    // console.log("VPCID-->  ", vpcId.toString());
    // // const vpcId = ssm.StringParameter.valueFromLookup(
    // //   this,
    // //   "/VpcProvider/VPCID"
    // // );
    // const vpc = ec2.Vpc.fromLookup(this, "SB-RCVPC", {
    //   vpcId: "vpc-09c0c359d8d0537c7",
    // });
    // const vpc = ec2.Vpc.fromLookup(this, "SB-RCVPC", {
    //   vpcId: vpcId.toString(),
    // });

    const securityGroupRDS = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      description: "Security group for RDS-Aurora Postgres",
    });
    securityGroupRDS.addIngressRule(
      // ec2.Peer.ipv4("10.40.0.0/16"), //make configurable
      ec2.Peer.ipv4(RDS_SEC_GRP_INGRESS),
      ec2.Port.tcp(5432),
      "Allow RDS traffic"
    );

    const subnetGroupRDS = new rds.SubnetGroup(this, "RDSSubnetGroup", {
      description: "Subnet for RDS Aurora",
      vpc: vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });
    // Create username and password secret for DB Cluster
    const secret = new rds.DatabaseSecret(this, "AuroraSecret", {
      username: "postgres",
    });
    const cluster = new rds.DatabaseCluster(this, "Database", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_14_6,
      }),
      credentials: rds.Credentials.fromSecret(secret),
      vpc: vpc,
      writer: rds.ClusterInstance.serverlessV2("writer"),
      serverlessV2MinCapacity: 2,
      serverlessV2MaxCapacity: 2,
      defaultDatabaseName: "registry",
      storageEncryptionKey: kmsKey,
      securityGroups: [securityGroupRDS],
      vpcSubnets: {
        subnetGroupName: "db-pvt-",
      },
    });

    this.rdsSecret = secret.secretArn;
    this.rdsHost = cluster.clusterEndpoint.hostname;
  }
}
