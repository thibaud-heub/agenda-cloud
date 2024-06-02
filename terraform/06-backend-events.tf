//aws_lb
resource "aws_lb" "lb-backend-events" {
  name               = "lb-backend-events"
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
resource "aws_lb_listener" "listener-backend-events" {
  load_balancer_arn = aws_lb.lb-backend-events.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-backend-events.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-backend-events" {
  name     = "tg-backend-events"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}


resource "aws_ecs_task_definition" "service-backend-events" {
  family = "service-backend-events"
  container_definitions = jsonencode([
    {
      name      = "backend-events-container"
      image     = "${aws_ecr_repository.backend-events.repository_url}:latest"
      cpu       = 128
      memory    = 128
      essential = true
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "MONGO_URI", value = "mongodb://${aws_lb.lb-backend-users.dns_name}:27017/agenda" },
      ]
      portMappings = [
        {
          containerPort = 3001
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


resource "aws_ecs_service" "backend-events" {
  name            = "backend-events"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.service-backend-events.arn
  desired_count   = 1
  iam_role        = var.lab_role

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-backend-events.arn
    container_name   = "backend-events-container"
    container_port   = 3001
  }
}
