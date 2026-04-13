import { USER_DATA_KEY, setAuthCookie, removeAuthCookie } from '@/lib/auth/auth'
import { logoutUser } from '@/lib/thunks/authThunks'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string | null
  plan: string
  quota?: number
  quotaUsed?: number
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  isInitialized: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.loading = false
      state.error = null
      state.isInitialized = true
      
      // Store token in localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token)
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(action.payload.user))
        setAuthCookie(action.payload.token)
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(state.user))
        }
      }
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.loading = false
      state.error = null
      state.isInitialized = true
      
      // Remove token from localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('access_token')
        localStorage.removeItem(USER_DATA_KEY)
        removeAuthCookie()
      }
    },
    initializeAuth: (state, action: PayloadAction<{ token: string; user: User } | null>) => {
      state.isInitialized = true
      
      if (action.payload) {
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        
        // Ensure cookie is set
        setAuthCookie(action.payload.token)
      } else {
        state.isAuthenticated = false
        state.token = null
        state.user = null
      }
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.loading = false
        state.error = null
        state.isInitialized = true
        
        // Don't call clearAllUserData here - let the component handle it
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if logout API fails, clear local state
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.loading = false
        state.error = action.payload || 'Logout failed'
        state.isInitialized = true
        
        // Don't call clearAllUserData here - let the component handle it
      })
  },
})

export const {
  setLoading,
  setError,
  loginSuccess,
  updateUserProfile,
  logout,
  initializeAuth,
  setInitialized,
} = authSlice.actions

export default authSlice.reducer
