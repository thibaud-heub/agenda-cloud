//aws_lb
resource "aws_lb" "lb-front" {
  name               = "lb-front"
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
resource "aws_lb_listener" "listener-front" {
  load_balancer_arn = aws_lb.lb-front.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-front.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-front" {
  name     = "tg-front"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}


resource "aws_ecs_task_definition" "service-front" {
  family = "service-front"
  container_definitions = jsonencode([
    {
      name      = "front-container"
      image     = "${aws_ecr_repository.front.repository_url}:latest"
      cpu       = 128
      memory    = 128
      essential = true
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "USERS_API", value = "http://${aws_lb.lb-backend-users.dns_name}" },
        { name = "EVENTS_API", value = "http://${aws_lb.lb-backend-events.dns_name}" }
      ]
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 0
        }
      ]
      dependsOn = [
        {
          containerName = "backend-users-container"
          condition     = "START"
        },
        {
          containerName = "backend-events-container"
          condition     = "START"
        }
      ]
    }
  ])

}


resource "aws_ecs_service" "front" {
  name            = "front"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.service-front.arn
  desired_count   = 1
  iam_role        = var.lab_role

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-front.arn
    container_name   = "front-container"
    container_port   = 5000
  }
}
