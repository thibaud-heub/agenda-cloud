//aws_lb
resource "aws_lb" "lb-backend-users" {
  name               = "lb-backend-users"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.main_security_group.id]
  subnets            = [aws_subnet.pub1a.id, aws_subnet.pub1b.id]

  enable_deletion_protection = true

  tags = {
    Environment = "production"
  }
}

//aws_lb_listener
resource "aws_lb_listener" "listener-backend-users" {
  load_balancer_arn = aws_lb.lb-backend-users.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-backend-users.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-backend-users" {
  name     = "tg-backend-users"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}


resource "aws_ecs_task_definition" "service-backend-users" {
  family = "service-backend-users"
  container_definitions = jsonencode([
    {
      name      = "backend-users-container"
      image     = "${aws_ecr_repository.backend-users.repository_url}:latest"
      cpu       = 128
      memory    = 128
      essential = true
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "MONGO_URI", value = "mongodb://${aws_lb.lb-backend-users.dns_name}:27017/agenda" },
      ]
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 0
        }
      ]
      dependsOn = [
        {
          containerName = "db-container"
          condition     = "START"
        }
      ]
    }
  ])

}


resource "aws_ecs_service" "backend-users" {
  name            = "backend-users"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.service-backend-users.arn
  desired_count   = 1
  iam_role        = var.lab_role

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-backend-users.arn
    container_name   = "backend-users-container"
    container_port   = 3000
  }
}
