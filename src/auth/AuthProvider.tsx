import { createContext, useContext, useEffect, useState } from "react";
import { useUserToken } from "../token/userToken";

import { useProfileService } from "../services/profile.service"
import { useAuthService } from "../services/auth.service"

const AuthContext = createContext(null)


export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const login = async (user, access:string) => {
        useUserToken.setAccessToken(access)
        setUser(user)

        // Process login
    }

    const logout = async () => {
        // Logout
        
        await useAuthService.logout()
        useUserToken.clearAccessToken()
        setUser(null)
    }

    const fetchProfile = async () => {
        // Fetch profile
        try {
            const res = await useProfileService.getProfile()
            setUser(res.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <AuthContext.Provider value={{user, loading, login, logout, isAuthenticated: !!user}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)