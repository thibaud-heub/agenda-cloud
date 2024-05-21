//aws_lb
resource "aws_lb" "lb-ui" {
  name               = "lb-ui"
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
resource "aws_lb_listener" "listener-ui" {
  load_balancer_arn = aws_lb.lb-ui.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-ui.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-ui" {
  name     = "tg-ui"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}


  resource "aws_ecs_task_definition" "service-ui" {
    family = "service-ui"
    container_definitions = jsonencode([
      {
        name      = "hello-ui-container"
        image     = "${aws_ecr_repository.hello-ui.repository_url}:latest"
        cpu       = 128
        memory    = 128
        essential = true
        environment = [
          {name="MICROSERVICE_URL", value="http://${aws_lb.lb-ms.dns_name}"}
        ]
        portMappings = [
          {
            containerPort = 5000
            hostPort      = 0
          }
        ]
      }
    ])

  }


  resource "aws_ecs_service" "hello-ui" {
    name            = "hello-ui"
    cluster         = aws_ecs_cluster.ecs_cluster.id
    task_definition = aws_ecs_task_definition.service-ui.arn
    desired_count   = 1
    iam_role        = var.lab_role

    load_balancer {
      target_group_arn = aws_lb_target_group.tg-ui.arn
      container_name   = "hello-ui-container"
      container_port   = 5000
    }
  }