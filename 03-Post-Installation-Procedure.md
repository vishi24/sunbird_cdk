# Post Installation Steps

## Project Setup and Keycloak Configuration

This README provides instructions for verifying EKS cluster including pod, deployment and services. It also includes steps for configuring Keycloak after its installation and initial admin UI preparation. 

### 1. Check Pod and Service Status

Ensure all pods are running and check the service status in your specified namespace.

```bash
kubectl get pods -n <namespace>
kubectl get deployments -n <namespace>
# Copy load-balancer endpoint from admin UI and Keycloak services
kubectl get svc -n <namespace>
```

All pods should be in a running state, and services should be available. Copy the AWS Load-balancer endpoint for admin UI and Keycload service.

### 2. Configure Keycloak database

2.1. Install pgsql client to access database. Run this command from Cloud9 environment.
```bash
dnf install postgresql
```
2.2. To connect to database run below command, check RDS Postgres DB name from AWS console.
```bash
psql -h <db host url> -U <user> -p 5432 -d <dbname>
```
```bash
psql -h <db host url> -U postgres -p 5432 -d postgres
```
2.3. To List available databases
```bash
\l
```
2.4. Switch connection to keycloak database
```bash
\c keycloak
``` 
2.5. Inside keycloak database run below command to disable ssl.
```bash
update REALM set ssl_required='NONE' where name = 'master';
```
### 3. Configure Keycloak Realms

Open a web browser and follow these steps to configure Keycloak realms:

3.1. Open the Keycloak URL in your browser.

3.2. Log in using the default administrator credentials:

   - **Username**: admin
   - **Password**: admin123

3.3 Download sunbird-rc realm from
    <update_url>
    
3.4. Select top left sidebar and select add realm and export the downloaded file 04-sunbird-rc-realm.json

3.5. Go to the "Realm" section.

### 4. Configure Sunbird-RC Realm

4.1. Inside the "Sunbird-RC" realm, go to the "Frontend" subsection.

4.2. Update the "Frontend URL" with the following value:

   - Admin UI URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/auth](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/auth)

### 5. Configure Client Registry Frontend Realm 

5.1. In the "Client Registry Frontend" subsection, update the "Valid Redirect URL" with the following value:

   - Admin UI URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*)

5.2. In the "Client Registry Web Origin" subsection, update the "Web Origin URL" with the following value:

   - Admin UI URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com)

### 6. Configure Admin-Frontend Realm

6.1. Inside the "Admin-frontend" realm, update the "Valid Redirect URL" with the following value:

   - Valid Redirect URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*)

6.2. Update the "Web Origin URL" with the following value:

   - Web Origin URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com)

### 7. Configure Admin-Portal Realm

7.1. Inside the "Admin-Portal" realm, update the "Valid Redirect URL" with the following value:

   - Valid Redirect URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com/*)

7.2. Update the "Web Origin URL" with the following value:

   - Web Origin URL: [http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com](http://sbrc-admin-ui-x1x1x1x1x1.elb.ap-south-1.amazonaws.com)

### 8. Add users 

8.1. Select users
8.2. Add users 
8.3. In attributes add mobile_num and email_id

### Configuration Complete
Once you've completed these steps, your Keycloak instance is configured as required. Ensure that the URLs and settings match your specific deployment and use case. Enjoy using Keycloak for your project and begin using Sunbird RC admin UI.
