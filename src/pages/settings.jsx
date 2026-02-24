import Navbar from "@/components/layout/Header";

export default function Settings() {  // ← capital S
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings.</p>
      </div>
    </div>
  );
}