# Floodify — Real-time Flood Monitoring & Safety

Floodify allows users to monitor flood-affected areas, report incidents, and find nearby shelters and hospitals. It helps people stay informed and stay safe, and helps authorities manage real-time flood situations effectively.

- **Repo:** https://github.com/mantu0tech/Floodify.git
- **Live App:** deployed on AWS EKS behind an Application Load Balancer

##Architecture 
<img width="800" height="319" alt="image" src="https://github.com/user-attachments/assets/a58c4471-8c5a-42f6-a725-3d7bc39eadaa" />
<img width="821" height="430" alt="image" src="https://github.com/user-attachments/assets/42ef81f9-b4ff-447f-96ff-72fb9870d68d" />


<img width="998" height="516" alt="image" src="https://github.com/user-attachments/assets/959e3cb3-0588-4e00-adbe-996384ee85c7" />

(<img width="1021" height="527" alt="image" src="https://github.com/user-attachments/assets/552e47a9-cb3e-4bbe-9683-b9a3d51261a2" />
)

---

## Architecture

Infrastructure is provisioned with **Terraform**, the app runs on **AWS EKS**, and **Jenkins** automates the build → push → deploy cycle on every change.


**Flow:** Terraform provisions the EKS cluster and VPC → the AWS Load Balancer Controller and EBS CSI driver are installed on the cluster → application manifests (namespace, secrets, configmap, MySQL, backend, frontend, ingress) are applied in order → the Ingress provisions an ALB automatically → Jenkins takes over from there for ongoing updates: it scans the repo, builds fresh frontend/backend images, pushes them to ECR, and rolls out the update to the running deployments.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Infrastructure as Code | Terraform |
| Container Orchestration | Kubernetes (AWS EKS) |
| Containers | Docker |
| Ingress / Load Balancing | AWS Load Balancer Controller (ALB Ingress) |
| Storage | Amazon EBS (via EBS CSI Driver) |
| Database | MySQL (in-cluster) |
| CI/CD | Jenkins |
| Secret Scanning | Gitleaks |
| Registry | Amazon ECR |

---

## Prerequisites

- AWS account
- Windows + Terraform installed
- AWS CLI configured on Windows (for Terraform)
- An IAM role with admin access, to attach to the EC2 instance
- An Ubuntu EC2 instance (m7 large or similar) to run the deployment from

---

## 1. Launch the Server

1. Launch an Ubuntu EC2 instance (m7 large).
2. Attach the IAM role with admin access to the instance.
3. Connect to the instance via SSH.
4. Install all prerequisites listed in `install.sh` in the repo.

Verify the IAM role is attached correctly:
```bash
aws sts get-caller-identity
```

On your Windows machine, configure the AWS CLI so Terraform can authenticate:
```bash
aws configure
```

---

## 2. Provision Infrastructure with Terraform

1. Open `EKS.tf` in the `terraform/` folder.
2. Copy the ARN of the IAM role you attached to the EC2 instance and paste it in on line 18.
3. Run Terraform:

```bash
terraform init         # downloads modules (~2 min first time)
terraform fmt           # formats code
terraform validate      # checks for errors
terraform plan           # review what will be created
terraform apply          # type 'yes' — takes ~15 min
```

Grab a coffee — the EKS cluster takes about 15 minutes to come up.

---

## 3. Connect to the Cluster

```bash
aws eks update-kubeconfig --name Floodify-eks --region us-east-1
kubectl get nodes
```

**Getting a 443 error?** Your EC2 instance's security group needs to reach the cluster's control plane. Go to the EKS cluster's main security group and add an inbound rule allowing all traffic from your EC2 instance's security group.

---

## 4. Install Cluster Add-ons

Run the commands in `cmd.txt` (devops branch) one by one, in this order.

**Helm repo:**
```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```

**Get cluster VPC ID:**
```bash
aws eks describe-cluster --name Floodify-eks --region us-east-1 \
  --query "cluster.resourcesVpcConfig.vpcId" --output text
```

**AWS Load Balancer Controller:**
```bash
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.2/docs/install/iam_policy.json

aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json

eksctl utils associate-iam-oidc-provider --cluster Floodify-eks --region us-east-1 --approve

eksctl create iamserviceaccount \
  --cluster=Floodify-eks \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::<your-account-id>:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve \
  --region us-east-1
```
This step takes a little while — it's creating the IAM service account behind the scenes.

```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=Floodify-eks \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=<your-vpc-id>

kubectl get deployment -n kube-system aws-load-balancer-controller
```

**EBS CSI Driver (for MySQL's persistent storage):**
```bash
eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster Floodify-eks \
  --region us-east-1 \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --role-only \
  --role-name AmazonEKS_EBS_CSI_DriverRole

eksctl create addon \
  --name aws-ebs-csi-driver \
  --cluster Floodify-eks \
  --region us-east-1 \
  --service-account-role-arn arn:aws:iam::<your-account-id>:role/AmazonEKS_EBS_CSI_DriverRole \
  --force
```

---

## 5. Deploy the Application

Apply the manifests **in this exact sequence** — MySQL needs to come up before backend/frontend:

```bash
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-configmap.yaml
kubectl apply -f 03-mysql.yaml
kubectl apply -f 04-backend.yaml
kubectl apply -f 05-frontend.yaml
kubectl apply -f 06-ingress.yaml
```

**Verify everything came up:**
```bash
kubectl get all -n floodify
kubectl get pvc -n floodify
kubectl get ingress -n floodify
```

Wait 2–3 minutes for the ALB to provision, then get the live URL:
```bash
kubectl get ingress floodify-ingress -n floodify -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## Troubleshooting

**Load balancer hostname not showing up / Ingress stuck?** Check the controller and re-attach permissions if needed:

```bash
kubectl describe sa aws-load-balancer-controller -n kube-system
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
cat iam_policy.json

aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicyV2 \
  --policy-document file://iam_policy.json

aws iam attach-role-policy \
  --role-name <your-eksctl-generated-role-name> \
  --policy-arn arn:aws:iam::<your-account-id>:policy/AWSLoadBalancerControllerIAMPolicyV2

kubectl get all -n floodify
kubectl rollout restart deployment aws-load-balancer-controller -n kube-system
kubectl logs -n kube-system deployment/aws-load-balancer-controller -f
```

If it's still not resolving, go to the AWS Console → EC2 → Load Balancers, find the ELB that was created, and confirm its DNS name matches what you expect.

**Get the frontend's public URL directly (bypassing Ingress) if needed:**
```bash
kubectl get svc frontend -n floodify
# copy the EXTERNAL-IP and open it in your browser
```

**Check that storage is working** — you should see your EBS volume backing the MySQL PVC, and your data should persist across pod restarts:
```bash
kubectl get pvc -n floodify
```

---

## CI/CD — Jenkins

Once the cluster is up and the app is deployed manually the first time, Jenkins takes over for every future update — no more manual `kubectl apply` needed.

**What the pipeline does:**
1. Checks out the latest code
2. Scans the repo for leaked secrets with **Gitleaks**
3. Builds fresh Docker images for `frontend` and `backend`
4. Pushes both images to **Amazon ECR**
5. Updates the running `frontend` and `backend` deployments in EKS with the new image tags and waits for rollout to complete

**Jenkinsfile:**
```groovy
pipeline {
    agent any

    environment {
        AWS_REGION     = "us-east-1"
        AWS_ACCOUNT_ID = "<your-account-id>"
        NAMESPACE      = "floodify"
        IMAGE_TAG      = "${BUILD_NUMBER}"

        BACKEND_REPO   = "floodify-backend"
        FRONTEND_REPO  = "floodify-frontend"
        BACKEND_URI    = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_REPO}"
        FRONTEND_URI   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mantu0tech/Floodify.git'
            }
        }

        stage('Gitleaks - Scan Repo for Leaked Secrets') {
            steps {
                sh '''
                docker run --rm -v "$PWD":/repo zricethezav/gitleaks:latest \
                    detect --source=/repo --no-git -v --exit-code 1
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${BACKEND_REPO}:${IMAGE_TAG} -f floodify_backend/Dockerfile floodify_backend
                docker build -t ${FRONTEND_REPO}:${IMAGE_TAG} -f Dockerfile .
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                docker tag ${BACKEND_REPO}:${IMAGE_TAG} ${BACKEND_URI}:${IMAGE_TAG}
                docker tag ${FRONTEND_REPO}:${IMAGE_TAG} ${FRONTEND_URI}:${IMAGE_TAG}

                docker push ${BACKEND_URI}:${IMAGE_TAG}
                docker push ${FRONTEND_URI}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                kubectl set image deployment/backend backend=${BACKEND_URI}:${IMAGE_TAG} -n ${NAMESPACE}
                kubectl set image deployment/frontend frontend=${FRONTEND_URI}:${IMAGE_TAG} -n ${NAMESPACE}

                kubectl rollout status deployment/backend -n ${NAMESPACE}
                kubectl rollout status deployment/frontend -n ${NAMESPACE}
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }
        failure {
            echo 'Deployment Failed'
        }
    }
}
```

> **Note:** This assumes Jenkins runs on an EC2 instance with an IAM role attached (the same admin role from the prerequisites step), and that `aws eks update-kubeconfig` has already been run once on that server so `kubectl` is pre-configured — no AWS keys or kubeconfig setup needed inside the pipeline itself. Adjust the `docker build` paths/deployment names above to match your actual folder structure and Kubernetes manifest names if they differ (e.g. `floodify_backend`, `public`, `src`).

---

## Notes

- Namespace for the app is `floodify`.
- MySQL data is persisted via an EBS-backed PersistentVolumeClaim, so it survives pod restarts.
- Always run `kubectl apply -f 00-namespace.yaml` through `06-ingress.yaml` in order the first time — backend depends on MySQL, and ingress depends on both services existing.
