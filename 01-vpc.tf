
resource "aws_vpc" "main"{
    cidr_block = "172.16.0.0/16"
}

#passerelle
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main"
  }
}

#table de routage publique
resource "aws_route_table" "pub" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "main"
  }
}

#création de 4 sous réseaux, 2 publiques 2 privés
resource "aws_subnet" "pub1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.16.0.0/24" 
  availability_zone = "us-east-1a" 
  tags={
    Name = "pub1a"
  }           
}
resource "aws_subnet" "pub1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.16.1.0/24" 
  availability_zone = "us-east-1b"    
  tags={
    Name = "pub1b"
  }        
}
resource "aws_subnet" "priv1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.16.2.0/24" 
  availability_zone = "us-east-1a"    
  tags={
    Name = "priv1a"
  }        
}
resource "aws_subnet" "priv1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.16.3.0/24" 
  availability_zone = "us-east-1b"  
  tags={
    Name = "priv1b"
  }     
}

#table de routage privée
resource "aws_route_table" "priv" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main"
  }
}


#association des tables de routages privées et publiques aux subnets (sous réseaux)
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.pub1a.id
  route_table_id = aws_route_table.pub.id
}
resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.pub1b.id
  route_table_id = aws_route_table.pub.id
}
resource "aws_route_table_association" "c" {
  subnet_id      = aws_subnet.priv1a.id
  route_table_id = aws_route_table.priv.id
}
resource "aws_route_table_association" "d" {
  subnet_id      = aws_subnet.priv1b.id
  route_table_id = aws_route_table.priv.id
}


resource "aws_security_group" "main_security_group" {
 name        = "hello-ecs-sg"
 description = "Allow All Ports Inbound and Outbound"


 vpc_id = aws_vpc.main.id
}


# Allow ALB to contact the ECS containers range ports
resource "aws_security_group_rule" "open-all-ingress" {
 type = "ingress"


 from_port = 0
 to_port   = 65535


 protocol = "tcp"


 description = "Allow traffic to containers"


 cidr_blocks = ["0.0.0.0/0"]


 # The security group to apply this rule to.
 security_group_id = aws_security_group.main_security_group.id
}


# Allow ALB to contact the ECS containers range ports
resource "aws_security_group_rule" "open-all-egress" {
 type = "egress"


 from_port = 0
 to_port   = 65535


 protocol = "tcp"


 description = "Allow traffic from containers"


 cidr_blocks = ["0.0.0.0/0"]


 # The security group to apply this rule to.
 security_group_id = aws_security_group.main_security_group.id
}


resource "aws_nat_gateway" "private_nat_gateway" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.pub1a.id

  tags = {
    Name = "hello-nat-gateway"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.gw]
}

resource "aws_eip" "nat" {
  vpc = true
}

resource "aws_route" "private_nat_gateway" {
  route_table_id            = aws_route_table.priv.id
  destination_cidr_block    = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.private_nat_gateway.id
}


