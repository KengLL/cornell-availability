import { AvailabilityProvider, useAvailabilityContext } from './context/AvailabilityContext';
import { Header } from './components/Header';
import { CampusMap } from './components/CampusMap';
import { BuildingDetail } from './components/BuildingDetail';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-12 h-12 border-4 border-cornell-red border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600">Loading campus data...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 p-4">
      <div className="text-red-500 text-6xl">!</div>
      <h2 className="text-xl font-semibold text-gray-800">Error Loading Data</h2>
      <p className="text-gray-600 text-center">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-cornell-red text-white rounded-lg hover:bg-cornell-darkRed transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

function AppContent() {
  const { loading, error, selectedBuilding, setSelectedBuilding } = useAvailabilityContext();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <main className="flex-1 overflow-hidden relative">
        <CampusMap />

        {/* Building detail overlay */}
        {selectedBuilding && (
          <div
            className="absolute inset-0 z-[1001] flex items-start justify-center bg-black/30 px-4 pt-6 pb-4"
            onClick={() => setSelectedBuilding(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl min-h-[50vh] max-h-[88vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <BuildingDetail />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <AvailabilityProvider>
      <AppContent />
    </AvailabilityProvider>
  );
}
