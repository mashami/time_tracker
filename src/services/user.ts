import {
  AnnouncementTypes,
  changeLeaveTypes,
  DepartmentTypes,
  getLeavesByUserTypes,
  invitationType,
  LeaveType,
  MessageTypes,
  registerType,
  SigninType,
  SignupType,
  UpdateDepartmentNameProps,
  UpdateLeaveProps,
  UpdateUserManagerProps
} from "@/utils/types"

export const logIn = async ({ email, password }: SigninType) => {
  const response = await fetch(process.env.APP_URL + `/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const signUp = async ({
  email,
  password,
  name,
  departmentId,
  retypePassword,
  companyId,
  invitaionId,
  role
}: SignupType) => {
  const response = await fetch(`/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      name,
      departmentId,
      retypePassword,
      companyId,
      invitaionId,
      role
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const register = async ({
  name,
  email,
  password,
  retypedPassword
}: registerType) => {
  const response = await fetch(`/api/register_company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, retypedPassword }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getUser = async (userId: string) => {
  const response = await fetch(process.env.APP_URL + `/api/getuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getUserInfo = async () => {
  const response = await fetch(`/api/getuserInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({}),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

//create_staff

// export const inviteUser = async ({
//   email,
//   departmentId,
//   invitationId
// }: invitationType) => {
//   const response = await fetch(`/api/create_staff`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, departmentId, invitationId }),
//     cache: "no-store"
//   })

//   const result = await response.json()

//   return result
// }

export const getInvitation = async (invitationId: string) => {
  const response = await fetch(process.env.APP_URL + `/api/getInvitation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const requestLeave = async ({
  startDate,
  endDate,
  description,
  title,
  departmentId
}: LeaveType) => {
  const response = await fetch(`/api/request_leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate,
      endDate,
      description,
      title,
      departmentId
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getLeaves = async (companyId: string) => {
  const response = await fetch(process.env.APP_URL + `/api/get_leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getLeaves2 = async (companyId: string, nextPage: number) => {
  const response = await fetch(`/api/get_leaves2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, page: nextPage }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getLeavesByUser = async ({
  userId,
  companyId
}: getLeavesByUserTypes) => {
  const response = await fetch(
    process.env.APP_URL + `/api/get_leaves_by_user`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, userId }),
      cache: "no-store"
    }
  )

  const result = await response.json()

  return result
}

export const deleteUser = async (userId: string) => {
  const response = await fetch(`/api/delete_staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const changeLeave = async ({ leaveId, status }: changeLeaveTypes) => {
  const response = await fetch(`/api/change_leave_status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaveId, status }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getAllUserAsignCompany = async (companyId: string) => {
  const response = await fetch(
    process.env.APP_URL + `/api/get_all_staff_asign_company`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
      cache: "no-store"
    }
  )

  const result = await response.json()

  return result
}

export const getAllInvitedUSers = async (companyId: string) => {
  const response = await fetch(
    process.env.APP_URL + `/api/get_all_staff_invitated`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
      cache: "no-store"
    }
  )

  const result = await response.json()

  return result
}

export const createAnnouncement = async ({
  departmentId,
  owner,
  description,
  audience
}: AnnouncementTypes) => {
  const response = await fetch(`/api/create_announcement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner,
      description,
      departmentId,
      audience
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const createMessage = async ({
  departmentId,
  message
}: MessageTypes) => {
  const response = await fetch(`/api/create_message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      departmentId
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getAnnouncementCompany = async (companyId: string) => {
  const response = await fetch(process.env.APP_URL + `/api/get_announcement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const deleteAnnouncement = async (announcementId: string) => {
  const response = await fetch(`/api/delete_announcement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ announcementId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const createDepartment = async ({
  companyId,
  name
}: DepartmentTypes) => {
  const response = await fetch(`/api/create_department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      companyId
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getCompanyDepartments = async (companyId: string) => {
  const response = await fetch(
    process.env.APP_URL + `/api/get_company_departments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
      cache: "no-store"
    }
  )

  const result = await response.json()

  return result
}

export const getCompanyDepartments2 = async ({
  companyId
}: DepartmentTypes) => {
  const response = await fetch(`/api/get_company_departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const inviteUser = async ({
  email,
  role,
  departmentId,
  invitationId
}: invitationType) => {
  const response = await fetch(`/api/invite_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      role,
      departmentId,
      invitationId
    }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const approveUser = async (userId: string) => {
  const response = await fetch(`/api/approve_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const UpdateLeaveDays = async ({
  companyId,
  leavesDays
}: UpdateLeaveProps) => {
  const response = await fetch(`/api/updateLeaveDays`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days: leavesDays, companyId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const getUsersByDepartment = async (departmentID: string) => {
  const response = await fetch(`/api/get_users_by_department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departmentID }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const DeleteDepartment = async (departmentId: string) => {
  const response = await fetch(`/api/delete_department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departmentId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const updateDepartmentName = async ({
  departmentId,
  departmentName
}: UpdateDepartmentNameProps) => {
  const response = await fetch(`/api/update_department`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departmentId, departmentName }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

export const updateUserManager = async ({
  departmentId,
  userId
}: UpdateUserManagerProps) => {
  const response = await fetch(`/api/make_user_manager`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departmentId, userId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}
