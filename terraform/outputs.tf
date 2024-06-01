//output "ssh-private-key-pem"{
//  value = tls_private_key.rsa-4096.private_key_pem
//  sensitive = true
//}

//output "public_ip"{
//  value = aws_instance.web.public_ip
//}

output "adress" {
    value = aws_lb.lb-ui.dns_name
}