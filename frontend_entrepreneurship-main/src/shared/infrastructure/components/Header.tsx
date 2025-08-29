import { FaChartLine, FaUser } from "react-icons/fa";
import { LogoutButton } from "../../../core/auth/infrastructure/components/LogoutButton";

// Definimos las propiedades que nuestro componente puede recibir
interface ModuleHeaderProps {
  title: string;
  userName: string | null;
  onProfileClick?: () => void; // Una función opcional para el clic
}

export function ModuleHeader({
  title,
  userName,
  onProfileClick,
}: ModuleHeaderProps) {
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      console.log(
        "Botón de perfil clickeado. No se proporcionó ninguna acción."
      );
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Columna Izquierda: Título */}
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaChartLine />
              <span>{title}</span> {/* Usamos la prop 'title' */}
            </h1>
          </div>

          {/* Columna Derecha: Botón de Bienvenida y Logout */}
          <div className="text-right flex items-center gap-4">
            <button
              onClick={handleProfileClick}
              className="bg-white/90 text-primary-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105 flex items-center gap-2"
            >
              <FaUser />
              {/* Usamos la prop 'userName', con un valor por defecto */}
              <span>Bienvenido, {userName ?? "Emprendedor"}</span>
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
