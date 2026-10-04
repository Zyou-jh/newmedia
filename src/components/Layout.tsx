import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const HIDE_FOOTER_PATHS = ['/login', '/register', '/dashboard'];

export default function Layout() {
  const { pathname } = useLocation();

  // 切换路由回到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  const hideFooter = HIDE_FOOTER_PATHS.some((p) => pathname.startsWith(p));

  return (
    <div className="relative min-h-screen bg-midnight text-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
