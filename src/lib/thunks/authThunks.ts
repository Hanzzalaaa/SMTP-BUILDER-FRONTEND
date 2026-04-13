import { createAsyncThunk } from '@reduxjs/toolkit'
import { performLogout } from '../auth/logout'
import type { RootState } from '../store/store'

// Async thunk for logout
export const logoutUser = createAsyncThunk<
  boolean, // Return type of the payload creator
  void,    // Argument type (no argument)
  { state: RootState; rejectValue: string } // ThunkAPI types
>(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const token = state.auth.token

      // Call logout API
      await performLogout(token ?? undefined)

      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return rejectWithValue('Logout API failed, but local data will be cleared by reducer')
    }
  }
)
