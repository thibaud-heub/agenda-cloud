resource "aws_ecr_repository" "hello-ui" {
  name                 = "hello-ui"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "hello-ms" {
  name                 = "hello-ms"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}