import { BelongType, Role, Status } from "@prisma/client"

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
  departmentId: string
  invitationId?: string
  role: Role
}

export interface SignupType {
  name: string
  email: string
  password: string
  departmentId: string | null
  retypePassword: string
  companyId: string
  invitaionId: string
  role: Role
}

export interface SvgTypes {
  className?: string
  color?: string
  width?: number
  height?: number
  onClick?: () => void
}

export interface LeaveType {
  startDate: Date
  endDate: Date
  title: string
  description: string
  departmentId: string
}

export interface changeLeaveTypes {
  leaveId: string
  status: Status
}

export interface getLeavesByUserTypes {
  companyId: string
  userId: string
}

export interface Department {
  dev: string
  designer: string
  manager: string
}

export interface AnnouncementTypes {
  owner: string
  description: string
  departmentId?: string
  audience: BelongType
}

export interface DepartmentTypes {
  companyId: string
  name?: string
}

export interface IsLoadingType {
  isLoadingIsProv: boolean
  isLoadingIsRej: boolean
}

export interface UpdateLeaveProps {
  companyId: string
  leavesDays: number
}

export interface UpdateDepartmentNameProps {
  departmentId: string
  departmentName: string
}

export interface UpdateUserManagerProps {
  departmentId: string
  userId: string
}
