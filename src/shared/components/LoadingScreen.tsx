/**
 * Loading Screen Component
 * Conforme ROADMAP.md - FASE 4.2
 */

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#0087A8]" />
        
        {/* Text */}
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-700">
            Carregando...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            SIVEPI V2
          </p>
        </div>
      </div>
    </div>
  );
}
