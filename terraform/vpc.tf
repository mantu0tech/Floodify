module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "Floodify-vpc"
  cidr = "10.0.0.0/16"

  azs                     = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets          = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  map_public_ip_on_launch = true

  enable_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true


  # Required tags for EKS to find subnets + create LoadBalancers
  public_subnet_tags = {
    "kubernetes.io/cluster/Floodify-eks" = "shared"
    "kubernetes.io/role/elb"             = "1"
  }

  tags = { Project = "Floodify  " }
}
