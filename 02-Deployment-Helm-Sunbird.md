# Sunbird RC Services Helm Chart

This Helm chart provides a convenient way to deploy the Sunbird RC services, which includes various microservices and components. 

# Prerequisites

Before deploying this Helm chart, ensure you have the following prerequisites in place:

1. [Git](https://git-scm.com/)
2. [Helm](https://helm.sh/) (installed on your local machine)
3. [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (installed on your local machine)
4. Access to a Kubernetes cluster

## Deploying the Sunbird RC Services

#### 1. Intialized Sunbird RC Helm Repository
```
helm repo add sunbird-rc <update_repo_url>
```

#### 2. Check the Helm Repo Status:
```
helm repo list
```

#### 3. Serach for Sunbrird RC Chat in Helm Repo:
```
helm search repo sunbird-rc
```
```
helm search repo sunbird-rc
NAME                    CHART VERSION   APP VERSION     DESCRIPTION
helm-example/sunbird-rc 0.3.0           0.0.13          A Helm chart for Sunbird RC
```

#### 4. Helm Chart Sunbird RC Framework Deployment Required following User Inputs:
   
   #### Helm global deployment properites:  
    
   | Secret Key                                     | Value   | Description                         |
   | ---------------------------------------------  | ------- | ----------------------------------- |
   | global.database.host                            | XXXXYY  | RDS/Data Host Address               |
   | global.secrets.DB_PASSWORD                     | XXXXYY  | Database Password                   |
   | global.secrets.access_key                      | XXXXYY  | Access Key                          |
   | global.secrets.MINIO_SECRET_KEY                | XXXXYY  | Minio Secret Key                    |

#### List of Micro Service Container Images:

| Image Name                                         | Tags       | Description                         |
|----------------------------------------------------|------------|-------------------------------------|
| ghcr.io/sunbird-rc/sunbird-rc-admin-portal         | main       | Admin-portal image |
| ghcr.io/sunbird-rc/sunbird-rc-certificate-api      | latest     | Certificate-api image |
| ghcr.io/sunbird-rc/sunbird-rc-certificate-signer   | latest     | Certificate-signer image |
| ghcr.io/sunbird-rc/sunbird-rc-claim-ms             | latest     | Claim-ms image     |
| ghcr.io/sunbird-rc/sunbird-rc-context-proxy-service | latest    | Context-proxy-service image |
| ghcr.io/sunbird-rc/sunbird-rc-keycloak             | latest     | Keycloak image      |
| ghcr.io/sunbird-rc/sunbird-rc-notification-service | latest     | Notification-service image |
| ghcr.io/sunbird-rc/sunbird-rc-public-key-service   | latest     | Public-key-service image |
| ghcr.io/sunbird-rc/sunbird-rc-core                 | v0.0.13    | Core:v0.0.13 image  |

   
#### 5. Install or Upgrade the Sunbird RC Framework via Helm Chart:
```
helm upgrade <release_name> sunbird-rc --set global.secrets.DB_PASSWORD="XXXXYY" --set global.secrets.access_key="XXXXYY" --set global.secrets.MINIO_SECRET_KEY="XXXXYY" --set global.database.host="XXXYY"
```
Replace `<release_name>` with a name for your release.

#### 6. Monitor the deployment status using the following command:
```bash
watch -n .5 kubectl get pods -n <namespace>
```

#### 7. After deployment, access the services and components as required.
```bash
kubectl get pods
kubectl get deploy
kubectl get svc 
helm list
```

## Upgrading the Helm Release

If you need to update or make changes to the services, you can upgrade the Helm release by following these steps:

#### 1. if you want you can create a input values.yaml file instead of supplies --set paramters during the commandline.
```
helm upgrade <release_name> . -f values.yaml
```

or 

#### 2. Upgrade the Helm release:

```bash
helm upgrade <release_name> sunbird-rc --set global.secrets.DB_PASSWORD="XXXXYY" --set global.secrets.access_key="XXXXYY" --set global.secrets.MINIO_SECRET_KEY="XXXXYY" --set global.secrets.host="XXXYY"
```
    
### Rollback a Release

In case of issues, you can roll back to a previous release:
```
helm rollback <RELEASE_NAME> <REVISION_NUMBER>
```

### Verify Rollback

After executing the rollback command, you can use helm history to confirm that the rollback was successful:
```
helm history <RELEASE_NAME>
```

### Uninstalling the Helm Release

To uninstall and remove all resources associated with the Helm release:

```
helm uninstall <release_name>
```

   
