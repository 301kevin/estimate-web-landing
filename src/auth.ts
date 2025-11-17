export const saveToken = (t: string) => localStorage.setItem("accessToken", t);
export const loadToken = () => localStorage.getItem("accessToken");
export const clearToken = () => localStorage.removeItem("accessToken");
