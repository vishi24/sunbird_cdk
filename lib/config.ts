import * as dotenv from "dotenv";
import path = require("path");

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
  RDS_USER: string;
  RDS_PASSWORD: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  KEYCLOAK_DEFAULT_USER_PASSWORD: string;
  MINIO_USER: string;
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
  RDS_USER: process.env.RDS_USER || "postgres",
  RDS_PASSWORD: process.env.RDS_PASSWORD || "password123",
  KEYCLOAK_ADMIN_CLIENT_SECRET:
    process.env.KEYCLOAK_ADMIN_CLIENT_SECRET ||
    "YzllOTA1YTQtOWIyZi00NWU2LThlMDUtMTNjM2E5NTNmNjUx",
  KEYCLOAK_ADMIN_PASSWORD:
    process.env.KEYCLOAK_ADMIN_PASSWORD || "YWRtaW4xMjM=",
  KEYCLOAK_DEFAULT_USER_PASSWORD:
    process.env.KEYCLOAK_DEFAULT_USER_PASSWORD || "YWRtaW5AMTIz",
  MINIO_USER: process.env.MINIO_USER || "sbrc-miniuser",
});
