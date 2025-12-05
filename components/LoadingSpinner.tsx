export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  );
}

