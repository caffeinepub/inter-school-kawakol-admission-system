export default function SchoolHeader() {
  return (
    <header className="relative text-white shadow-lg overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/school-header-bg.dim_1400x500.jpg')",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/50 to-black/65"
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <img
            src="/assets/generated/school-logo.dim_1024x1024.png"
            alt="ISK Logo"
            className="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight drop-shadow-md">
              INTER SCHOOL KAWAKOL
            </h1>
            <p className="text-lg md:text-xl font-semibold text-yellow-300 drop-shadow-md mt-0.5">
              इंटर स्कूल कवाकोल, नवादा
            </p>
            <p className="text-sm md:text-base text-white/90 mt-1 drop-shadow-sm">
              Nawada, Bihar - Admission Portal
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
