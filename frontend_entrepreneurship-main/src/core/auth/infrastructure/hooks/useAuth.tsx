import { useState, useEffect, createContext, useContext } from 'react';
import { AuthRepositoryApi, type User, type LoginRequest, type RegisterRequest, type ResetPasswordRequest } from '../adapters/AuthRepositoryApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<User>;
  resetPassword: (data: ResetPasswordRequest) => Promise<{ message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔧 [FRONTEND] AuthProvider inicializando...');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  console.log('🔧 [FRONTEND] Creando instancia de AuthRepositoryApi...');
  const authRepository = new AuthRepositoryApi();
  console.log('🔧 [FRONTEND] AuthRepositoryApi creado exitosamente');

  // Verificar si hay un usuario guardado en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      const user = await authRepository.login(credentials);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<User> => {
    try {
      const user = await authRepository.register(userData);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    try {
      const result = await authRepository.resetPassword(data);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    resetPassword,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
