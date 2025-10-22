import { AuthContextType, SessionState, User } from '@/types/auth';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<SessionState>({
        token: null,
        user: null,
    });
    const [isLoading, setIsloding] = useState<boolean>(true)

    useEffect(() => {

        const loadSession = async () => {
            setIsloding(true)
            const session = await SecureStore.getItemAsync('session');
            if (session) {
                const noRawSession = JSON.parse(session)
                if (noRawSession?.token && noRawSession?.user) {
                    setSession({ token: noRawSession.token, user: noRawSession.user })
                } else {
                    setSession({ token: null, user: null });
                }
            } else {
                setSession({ token: null, user: null });
            }

            setIsloding(false)
        };

        loadSession();
    }, []);

    const authActions: AuthContextType = {
        login: async (token: string, userData: User) => {
            await SecureStore.setItemAsync('session', JSON.stringify({ token, user: userData }));
            setSession({ token, user: userData });
        },
        logout: async () => {
            await SecureStore.deleteItemAsync('session');
            setSession({ token: null, user: null });
        },
        session,
        isLoading
    };

    return (
        <AuthContext.Provider value={authActions}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};