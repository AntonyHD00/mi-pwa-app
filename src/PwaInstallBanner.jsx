import { useEffect, useState } from "react";

export default function PwaInstallBanner() {
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

    if (window.matchMedia("(display-mode: standalone)").matches) {
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
    if (!deferredPrompt) {
      alert("La instalación no está disponible aún. Usa Chrome en móvil o escritorio.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ App instalada");
    } else {
      console.log("❌ Instalación cancelada");
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">
        {isInstalled ? "✅ App ya instalada" : "📱 Instala la app"}
      </strong>
      <span className="block sm:inline ml-2">
        {isInstalled
          ? "Puedes abrirla desde tu pantalla de inicio."
          : "Haz clic para instalar esta PWA."}
      </span>
      <div className="mt-2">
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Instalar app
          </button>
        )}
        <button
          onClick={() => setShowBanner(false)}
          className="px-3 py-1 text-sm text-gray-700 hover:underline"
        >
          ✖ Cerrar
        </button>
      </div>
    </div>
  );
}
