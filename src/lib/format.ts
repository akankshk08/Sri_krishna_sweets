const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 1250 → "₹1,250" (Indian digit grouping). */
export const formatINR = (rupees: number): string => `₹${inr.format(rupees)}`;
