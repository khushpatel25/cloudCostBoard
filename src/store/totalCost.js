import { create } from "zustand";

export const useTotalCostStore = create((set) => ({
    totalPositiveCost: 0,
    totalNegativeCost: 0,
    serviceCosts: [],
    setTotalPositiveCost: (cost) => set((state) => ({...state, totalPositiveCost: cost })),
    setTotalNegativeCost: (cost) => set((state) => ({...state, totalNegativeCost: cost })),
    setServiceCost: (cost) => set((state) => ({...state,serviceCosts:cost}))
}))