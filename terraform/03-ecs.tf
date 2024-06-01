resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ecs-cluster"
}

module "cluster_instances" {
  source                = "./tf-aws-ecs-container-instance"
  name                  = "cluster_instance"
  ecs_cluster_name      = "${aws_ecs_cluster.ecs_cluster.name}"
  lc_instance_type      = "t2.micro"
  lc_security_group_ids = [aws_security_group.main_security_group.id]
  asg_subnet_ids        = [aws_subnet.pub1a.id, aws_subnet.pub1b.id, aws_subnet.priv1a.id, aws_subnet.priv1b.id]
  lab_instance_profile = var.lab_instance_profile
  lab_role = var.lab_role
  depends_on = [aws_nat_gateway.private_nat_gateway]
}