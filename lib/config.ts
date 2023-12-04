import * as dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export type ConfigProps = {
  REGION: string;
  ACCOUNT: string;
  CIDR: string;
  MAX_AZS: number;
  BUCKET_NAME: string;
  CHART: string;
  REPOSITORY: string;
  NAMESPACE: string;
  RELEASE: string;
  RDS_USER: string;
  RDS_PASSWORD: string;
  RDS_SEC_GRP_INGRESS: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  KEYCLOAK_DEFAULT_USER_PASSWORD: string;
  MINIO_USER: string;
  ROLE_ARN: string;
  EKS_CLUSTER_NAME: string;
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || "ap-south-1",
  ACCOUNT: process.env.ACCOUNT || "",
  CIDR: process.env.CIDR || "10.70.0.0/16",
  RDS_SEC_GRP_INGRESS: process.env.CIDR || "10.70.0.0/16",
  MAX_AZS: 2,
  BUCKET_NAME: process.env.BUCKET_NAME || "",
  CHART: "sunbird-rc",
  REPOSITORY: "https://amitvashist7.github.io/helm-example/",
  NAMESPACE: "sbrc-registry",
  RELEASE: "sbrc-registry",
  RDS_USER: process.env.RDS_USER || "postgres",
  RDS_PASSWORD: process.env.RDS_PASSWORD || "",
  KEYCLOAK_ADMIN_CLIENT_SECRET: "YzllOTA1YTQtOWIyZi00NWU2LThlMDUtMTNjM2E5NTNmNjUx",
  KEYCLOAK_ADMIN_PASSWORD:
    process.env.KEYCLOAK_ADMIN_PASSWORD || "admin@123",
  KEYCLOAK_DEFAULT_USER_PASSWORD:
    process.env.KEYCLOAK_DEFAULT_USER_PASSWORD || "admin@123",
  MINIO_USER: "sbrc-minio-user",
  ROLE_ARN: process.env.ROLE_ARN || "",
  EKS_CLUSTER_NAME: process.env.EKS_CLUSTER_NAME || "sunbird-rc"
});
