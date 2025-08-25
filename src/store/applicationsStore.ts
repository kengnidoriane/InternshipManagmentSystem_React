import { create } from 'zustand';

interface ApplicationsState {
  applicationsCounts: Record<number, number>; // offerId -> count
  setApplicationsCount: (offerId: number, count: number) => void;
  getApplicationsCount: (offerId: number) => number;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applicationsCounts: {},
  
  setApplicationsCount: (offerId: number, count: number) =>
    set((state) => ({
      applicationsCounts: {
        ...state.applicationsCounts,
        [offerId]: count,
      },
    })),
  
  getApplicationsCount: (offerId: number) => {
    const state = get();
    return state.applicationsCounts[offerId] || 0;
  },
}));