import {
  AnnouncementTypes,
  changeLeaveTypes,
  getLeavesByUserTypes,
  invitationType,
  LeaveType,
  registerType,
  SigninType,
  SignupType
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
  department,
  retypePassword,
  companyId,
  invitaionId
}: SignupType) => {
  const response = await fetch(`/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      name,
      department,
      retypePassword,
      companyId,
      invitaionId
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
  const response = await fetch(`/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, retypedPassword, password }),
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

//create_staff

export const inviteUser = async ({
  email,
  department,
  companyId,
  invitationId
}: invitationType) => {
  const response = await fetch(`/api/create_staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, department, companyId, invitationId }),
    cache: "no-store"
  })

  const result = await response.json()

  return result
}

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
  companyId,
  userId,
  startDate,
  endDate,
  description,
  title,
  department
}: LeaveType) => {
  const response = await fetch(`/api/request_leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId,
      userId,
      startDate,
      endDate,
      description,
      title
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

export const deleteUser = async ({
  userId,
  companyId
}: getLeavesByUserTypes) => {
  const response = await fetch(`/api/delete_staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, companyID: companyId }),
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
  companyId,
  owner,
  description,
  title
}: AnnouncementTypes) => {
  const response = await fetch(`/api/create_announcement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner,
      title,
      description,
      companyId
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
