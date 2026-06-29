import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerAuthor = (data: {
  full_name: string; email: string; password: string;
  phone?: string; institution?: string; designation?: string
}) => api.post('/auth/register', data)

export const verifyEmail = (token: string) =>
  api.post('/auth/verify-email', { token })

export const loginUser = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

// ── Registration ──────────────────────────────────────────────────────────────
export const getFees = () => api.get('/registration/fees')
export const createRegistration = (data: any) => api.post('/registration/create', data)
export const verifyPayment = (data: any) => api.post('/registration/verify-payment', data)
export const getRegistrationStatus = (email: string) => api.get(`/registration/status/${email}`)

// ── Abstracts ─────────────────────────────────────────────────────────────────
export const getThemes = () => api.get('/abstracts/themes')
export const submitAbstract = (formData: FormData) =>
  api.post('/abstracts/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const getAbstractStatus = (id: number) => api.get(`/abstracts/${id}`)
export const getAuthorAbstracts = (authorId: number) => api.get(`/abstracts/by-author/${authorId}`)

// ── Content ───────────────────────────────────────────────────────────────────
export const getAnnouncements = () => api.get('/announcements')
export const getDates = () => api.get('/dates')
export const getSpeakers = () => api.get('/speakers')
export const getGallery = () => api.get('/gallery')
export const getSponsors = () => api.get('/sponsors')
