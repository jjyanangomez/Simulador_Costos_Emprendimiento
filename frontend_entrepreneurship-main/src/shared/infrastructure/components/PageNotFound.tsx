import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-gradient-to-bl from-cyan-300">
      <h1 className="text-4xl text-center font-extrabold text-red-500 mb-4">
        404 not found
      </h1>
      <Link to="/">
        <button className="bg-yellow text-bluePrimary font-bold py-2 px-4 rounded-lg lg:text-base sm:text-sm">
          Volver al Inicio
        </button>
      </Link>
    </main>
  );
}
