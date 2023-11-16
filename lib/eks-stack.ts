import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as eks from "aws-cdk-lib/aws-eks";
import { ConfigProps } from "./config";
import { Stack, StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

import {
  GatewayVpcEndpointAwsService,
  Vpc,
  FlowLogTrafficType,
  FlowLogDestination,
  InterfaceVpcEndpoint,
} from "aws-cdk-lib/aws-ec2";

import { SubnetGroup } from "aws-cdk-lib/aws-rds";
// type AwsEnvStackProps = StackProps & {
//   config: Readonly<ConfigProps>;
// };
export interface EksStackProps extends cdk.StackProps {
  config: ConfigProps;
  vpc: ec2.Vpc;
}

export class eksStack extends cdk.Stack {
  //constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
  public readonly eksCluster: eks.FargateCluster;
  constructor(scope: Construct, id: string, props: EksStackProps) {
    super(scope, id, props);
    //const vpcId = cdk.Fn.importValue("SB-RCVPC");
    const vpc = props.vpc;
    const cidr = props.config.CIDR;
    console.log("Printing VPC ID imported in EKS", vpc.vpcId);

    const securityGroupEKS = new ec2.SecurityGroup(this, "EKSSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      description: "Security group for EKS",
    });

    // Add inbound rules to the security group - Needs to be checked

    securityGroupEKS.addIngressRule(
      // ec2.Peer.ipv4("10.40.0.0/16"), //make configurable
      ec2.Peer.ipv4(cidr),
      ec2.Port.allTraffic(),
      "Allow EKS traffic"
    );

    const iamRole = iam.Role.fromRoleArn(
      this,
      "MyIAMRole",
      "arn:aws:iam::370803901956:role/AWSReservedSSO_AWSAdministratorAccess_2961c11892dc6700"
    );

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
      clusterName: "eks-sbrc-new-v3",
      mastersRole: iamRole,
      outputClusterName: true,
      outputConfigCommand: true,
      // serviceIpv4Cidr: "10.60.0.0/16",
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

    console.log(this.eksCluster);

    const fargateProfile = this.eksCluster.addFargateProfile(
      "MyFargateProfile",
      {
        selectors: [{ namespace: "sbrc-registry" }],
      }
    );

    // const awsAuth = new eks.AwsAuth(this, "MyAwsAuth", {
    //   cluster: this.eksCluster,
    // });
  }
}
// const rdssecretARN = props.rdssecret;
// const appSecret = Secret.fromSecretCompleteArn(
//   this,
//   "rdssecret",
//   rdssecretARN
// );
// const user = appSecret.secretValueFromJson("username").toString();
// // const password = appSecret.secretValueFromJson("password").toString();

// const base64encodedpass = cdk.Fn.base64(
//   appSecret.secretValueFromJson("password").unsafeUnwrap.toString()
// );
// const vpcId = ssm.StringParameter.valueFromLookup(
//   this,
//   "/VpcProvider/VPCID"
// );
// const vpc = ec2.Vpc.fromLookup(this, "VPC", {
//   vpcId: vpcId,
// });
// const vpc = ec2.Vpc.fromLookup(this, "SB-RCVPC", {
//   vpcId: "vpc-09c0c359d8d0537c7",
// });
// new cdk.CfnOutput(this, "EKS kubectl role", {
//   value: eksCluster.kubectlRole.roleName,
// });
// const ChartdAsset = Asset(this, "ChartdAsset", {
//   path: "../infra/helm_charts",
// });

// new helm.HelmChart(this, "SBRC-HelmChart", {
//   cluster: eksCluster,
//   chart: "helm_charts",
//   // ]chartAsset: ChartdAsset,
//   release: "sunbirdrc",
//   values: {
//     "global.secrets.DB_PASSWORD": base64encodedpass,
//     //"global.secrets.ELASTIC_SEARCH_PASSWORD":"abc",
//     //"global.secrets.KEYCLOAK_ADMIN_CLIENT_SECRET":"abc",
//     // "global.secrets.KEYCLOAK_ADMIN_PASSWORD":"password",
//     "global.secrets.MINIO_SECRET_KEY": "QUtJQVZNVk5DUVlDSTNIRTJCWEM=",
//     "global.secrets.access_key":
//       "QzJvenppM3ZRUlVsSndDb1RaWVRjSXBHY0VzSFQ2a00vTyt5MXozVw==",
//     //"global.minio.bucket_key":"abc",
//   },
//   repository: "https://github.com/vishi24/cdktest/tree/main/", // Helm chart repository URL
// });
// Define the local path to your Helm chart folder
// const helmChartFolder = "./infra/helm_charts";

// // Create a Helm chart using the local folder as the source
// new helm.HelmChart(this, "MyHelmChart", {
//   cluster: eksCluster,
//   chart: helmChartFolder,
//   release: "sunbirdrc",
//   values: {
//     "global.secrets.DB_PASSWORD":
//       "aSx6M3NEZ1B6dEV3Mm1eMllrPUVIXkZrbWUsX2Fe",
//     //"global.secrets.ELASTIC_SEARCH_PASSWORD":"abc",
//     //"global.secrets.KEYCLOAK_ADMIN_CLIENT_SECRET":"abc",
//     // "global.secrets.KEYCLOAK_ADMIN_PASSWORD":"password",
//     "global.secrets.MINIO_SECRET_KEY": "QUtJQVZNVk5DUVlDSTNIRTJCWEM=",
//     "global.secrets.access_key":
//       "QzJvenppM3ZRUlVsSndDb1RaWVRjSXBHY0VzSFQ2a00vTyt5MXozVw==",
//     //"global.minio.bucket_key":"abc",
//   },
// });
