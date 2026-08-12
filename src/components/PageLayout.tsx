/**
 * PageLayout — shared wrapper for every non-WYLI page.
 * Renders the floating pill Navbar (always visible) + page content + Footer.
 */
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
