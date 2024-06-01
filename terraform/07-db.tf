//aws_lb
resource "aws_lb" "lb-db" {
  name               = "lb-db"
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
resource "aws_lb_listener" "listener-db" {
  load_balancer_arn = aws_lb.lb-db.arn
  port              = "27017"
  protocol          = "MONGODB"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg-db.arn
  }
}
//aws_lb_target.group
resource "aws_lb_target_group" "tg-db" {
  name     = "tg-db"
  port     = 27017
  protocol = "MONGODB"
  vpc_id   = aws_vpc.main.id
}


resource "aws_ecs_task_definition" "service-db" {
  family = "service-db"
  container_definitions = jsonencode([
    {
      name      = "db-container"
      image     = "${aws_ecr_repository.db.repository_url}:latest"
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
          containerPort = 27017
          hostPort      = 0
        }
      ]
    }
  ])

}


resource "aws_ecs_service" "db" {
  name            = "db"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.service-db.arn
  desired_count   = 1
  iam_role        = var.lab_role

  load_balancer {
    target_group_arn = aws_lb_target_group.tg-db.arn
    container_name   = "db-container"
    container_port   = 27017
  }
}
