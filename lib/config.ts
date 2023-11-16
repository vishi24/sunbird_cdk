import * as dotenv from "dotenv";
import path = require("path");
import { vpcStack } from "./vpc-stack";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export type ConfigProps = {
  REGION: string;
  ACCOUNT: string;
  CIDR: string;
  RDS_SEC_GRP_INGRESS: string;
  MAX_AZS: number;
  BUCKET_NAME: string;
  CHART: string;
  REPOSITORY: string;
  NAMESPACE: string;
  RELEASE: string;
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || "ap-south-1",
  ACCOUNT: process.env.ACCOUNT || "370803901956",
  CIDR: process.env.CIDR || "10.70.0.0/16",
  RDS_SEC_GRP_INGRESS: process.env.RDS_SEC_GRP_INGRESS || "10.70.0.0/16",
  MAX_AZS: 2,
  BUCKET_NAME: process.env.BUCKET_NAME || "sbrc-registry-201",
  CHART: process.env.CHART || "sunbird-rc",
  REPOSITORY:
    process.env.REPOSITORY || "https://amitvashist7.github.io/helm-example/",
  NAMESPACE: process.env.NAMESPACE || "sbrc-registry",
  RELEASE: process.env.RELEASE || "sbrc-registry",
});
