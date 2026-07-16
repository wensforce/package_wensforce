export default function PackageMediaSection({ images = [], videos = [] }) {
  if (!images.length && !videos.length) return null;

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1A202C] mb-3">
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-xl overflow-hidden border border-[#CBD5E0]"
              >
                <img
                  src={img.url}
                  alt={`Package image ${img.order + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1A202C] mb-3">
            Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-xl overflow-hidden border border-[#CBD5E0] bg-black"
              >
                <video
                  src={vid.url}
                  controls
                  className="w-full max-h-64 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}