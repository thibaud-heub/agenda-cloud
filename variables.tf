#   variable "profile" {}

# Replacer les defauts par les valeurs issues de la console AWS
variable "lab_role" {default="arn:aws:iam::171428066704:role/LabRole"}

variable "lab_instance_profile"{
    default = "arn:aws:iam::171428066704:instance-profile/LabInstanceProfile"
}