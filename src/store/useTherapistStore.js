import create from 'zustand'
import { generateTherapists } from '../utils/mockData'

const useTherapistStore = create((set) => ({
  therapists: [],
  loadMock: (count = 50) => set({ therapists: generateTherapists(count) }),
  setTherapists: (arr) => set({ therapists: arr }),
}))

export default useTherapistStore
