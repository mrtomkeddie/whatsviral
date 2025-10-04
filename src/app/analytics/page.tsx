
import { AppLayout } from "@/components/app/AppLayout";
import { Header } from "@/components/app/Header";

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-headline tracking-tight">
              User Analytics
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              This page is under construction.
            </p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
