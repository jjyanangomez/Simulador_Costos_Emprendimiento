import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white/90 text-primary-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105 flex items-center gap-2"
      title="Cerrar sesión"
    >
      <FaSignOutAlt />
      Cerrar Sesión
    </button>
  );
}
