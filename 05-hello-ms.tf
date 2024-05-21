//aws_lb
resource "aws_lb" "lb-ms" {
  name               = "lb-ms"
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
resource "aws_lb_listener" "listener-ms" {
  load_balancer_arn = aws_lb.lb-ms.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-ms.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-ms" {
  name     = "tg-ms"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/hello"
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = "200-499"
  }
}


  resource "aws_ecs_task_definition" "service-ms" {
    family = "service-ms"
    container_definitions = jsonencode([
      {
        name      = "hello-ms-container"
        image     = "${aws_ecr_repository.hello-ms.repository_url}:latest"
        cpu       = 128
        memory    = 128
        essential = true
        portMappings = [
          {
            containerPort = 5000
            hostPort      = 0
          }
        ]
      }
    ])

  }


  resource "aws_ecs_service" "hello-ms" {
    name            = "hello-ms"
    cluster         = aws_ecs_cluster.ecs_cluster.id
    task_definition = aws_ecs_task_definition.service-ms.arn
    desired_count   = 1
    iam_role        = var.lab_role

    load_balancer {
      target_group_arn = aws_lb_target_group.tg-ms.arn
      container_name   = "hello-ms-container"
      container_port   = 5000
    }
  }

