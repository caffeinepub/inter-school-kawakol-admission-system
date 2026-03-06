export default function SchoolHeader() {
  return (
    <header className="bg-gradient-to-r from-[oklch(0.35_0.15_145)] to-[oklch(0.25_0.12_145)] text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4">
          <img
            src="/assets/generated/school-logo.dim_1024x1024.png"
            alt="ISK Logo"
            className="h-20 w-20 md:h-24 md:w-24 object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              INTER SCHOOL KAWAKOL
            </h1>
            <p className="text-sm md:text-base text-white/90 mt-1">
              Nawada, Bihar - Admission Portal
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
