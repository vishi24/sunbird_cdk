import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { ConfigProps } from "./config";

export interface EksStackProps extends cdk.StackProps {
  config: ConfigProps;
  vpc: ec2.Vpc;
}

export class eksStack extends cdk.Stack {
  public readonly eksCluster: eks.FargateCluster;
  constructor(scope: Construct, id: string, props: EksStackProps) {
    super(scope, id, props);
    const vpc = props.vpc;
    const cidr = props.config.CIDR;
    const ROLE_ARN = props.config.ROLE_ARN;
    const EKS_CLUSTER_NAME = props.config.EKS_CLUSTER_NAME;

    const securityGroupEKS = new ec2.SecurityGroup(this, "EKSSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      description: "Security group for EKS",
    });

    securityGroupEKS.addIngressRule(
      ec2.Peer.ipv4(cidr),
      ec2.Port.allTraffic(),
      "Allow EKS traffic"
    );

    const iamRole = iam.Role.fromRoleArn(this, "MyIAMRole", ROLE_ARN);

    const readonlyRole = new iam.Role(this, "ReadOnlyRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    readonlyRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("ReadOnlyAccess")
    );

    this.eksCluster = new eks.FargateCluster(this, "MyCluster", {
      vpc: vpc,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
      version: eks.KubernetesVersion.V1_27,
      securityGroup: securityGroupEKS,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      clusterName: EKS_CLUSTER_NAME,
      mastersRole: iamRole,
      outputClusterName: true,
      outputConfigCommand: true,
      albController: {
        version: eks.AlbControllerVersion.V2_5_1,
        repository: "public.ecr.aws/eks/aws-load-balancer-controller",
      },
    });
    new cdk.CfnOutput(this, "EKS Cluster Name", {
      value: this.eksCluster.clusterName,
    });
    new cdk.CfnOutput(this, "EKS Cluster Arn", {
      value: this.eksCluster.clusterArn,
    });

    const fargateProfile = this.eksCluster.addFargateProfile(
      "MyFargateProfile",
      {
        selectors: [{ namespace: EKS_CLUSTER_NAME }],
      }
    );
  }
}
