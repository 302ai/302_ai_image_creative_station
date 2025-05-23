import AppFooter from "@/components/global/app-footer";
import HomeHeader from "@/components/home/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader className="mb-4 mt-6 h-12" />
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <div className="grid flex-1">
          <div className="container relative mx-auto flex h-auto w-full max-w-[1440px] items-start rounded-lg border bg-background px-6 py-4 shadow-sm">
            {children}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
