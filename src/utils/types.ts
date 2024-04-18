import { Status } from "@prisma/client"

export interface SigninType {
  email: string
  password: string
}

export interface registerType {
  name: string
  email: string
  password: string
  retypedPassword: string
}

export interface invitationType {
  email: string
  department: string
  companyId: string
  invitationId?: string
}

export interface SignupType {
  name: string
  email: string
  password: string
  department: string
  retypePassword: string
  companyId: string
  invitaionId: string
}

export interface SvgTypes {
  className?: string
  onClick?: () => void
}

export interface LeaveType {
  startDate: Date
  endDate: Date
  title: string
  description: string
  userId: string
  companyId: string
}

export interface changeLeaveTypes {
  leaveId: string
  status: Status
}

export interface getLeavesByUserTypes {
  companyId: string
  userId: string
}
