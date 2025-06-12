import { useEffect, useState } from "react";

export default function PwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
    };

    // Verificar si ya está instalada (modo standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("App instalada");
      } else {
        console.log("Instalación cancelada");
      }
      setDeferredPrompt(null);
    } else {
      alert("Instalación no disponible aún. Usa Chrome en Android o escritorio.");
    }
  };

  if (!showBanner) return null;

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">¿Quieres instalar esta app?</strong>
      <span className="block sm:inline ml-2">
        {isInstalled ? "Ya está instalada." : "Instálala para acceder más rápido."}
      </span>
      <div className="mt-2">
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
        >
          Instalar app
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="px-4 py-2 text-sm text-gray-600 hover:underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
