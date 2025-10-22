export interface Page {
    name: string;
    url: string;
    emoji: string;
}

export interface FormattedModule {
    id: string;
    name: string;
    emoji: string;
    pages: Page[];
}

export interface User {
    fullName: string;
    email: string;
    modulos: FormattedModule[];
}

export interface SessionState {
    token: string | null;
    user: User | null;
}

export interface AuthContextType {
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    session: SessionState;
    isLoading: boolean;
}
