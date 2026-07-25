// Mobile version
'use client';
import React, { useState, useContext, useRef, useLayoutEffect, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import { Menu, X } from 'lucide-react';

// Kept outside the component so it survives remounts caused by route changes.
// (module-level, not React state - this is what lets us restore scroll
// position even though the whole sidebar unmounts/remounts on navigation)
let savedSidebarScrollTop = 0;

const navSections = [
  {
    label: 'MAIN',
    items: [
      { icon: '📊', label: 'Dashboard', key: 'dashboard', path: '/admin/dashboard' },
      { icon: '🏛️', label: 'Halls & Venues', key: 'halls', path: '/admin/halls' },
      { icon: '📅', label: 'Event Bookings', key: 'bookings', path: '/admin/bookings' },
    ],
  },
  {
    label: 'FINANCIAL',
    items: [
      { icon: '💳', label: 'Payments', key: 'payments', path: '/admin/payments' },
      { icon: '💰', label: 'Hall Pricing', key: 'pricing', path: '/admin/hall-pricing' },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { icon: '🎁', label: 'Booking Services', key: 'services', path: '/admin/booking-services' },
      { icon: '✨', label: 'Hall Amenities', key: 'amenities', path: '/admin/hall-amenities' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { icon: '👥', label: 'Customers', key: 'customers', path: '/admin/customers' },
      { icon: '👤', label: 'System Users', key: 'users', path: '/system_users' },
      { icon: '👤', label: 'Employees', key: 'employees', path: '/admin/employees' },
      { icon: '🛡️', label: 'Roles', key: 'roles', path: '/admin/roles' },
      { icon: '📜', label: 'Activity Log', key: 'activities', path: '/admin/activities' },
      { icon: '📈', label: 'Reports & Analytics', key: 'reports', path: '/admin/reports' },
    ],
  },
];

export default function AdminSideNavbarCom() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useContext(AuthContext);
  const scrollContainerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeScreen, setActiveScreen] = useState(() => {
    // Determine active screen based on current path
    const currentPath = pathname || '/admin/dashboard';
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.path === currentPath) {
          return item.key;
        }
      }
    }
    return 'dashboard';
  });

  // Restore the scroll position immediately after this sidebar remounts,
  // BEFORE the browser paints (useLayoutEffect, not useEffect) so there's
  // no visible flash/jump back to the top when navigating.
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = savedSidebarScrollTop;
    }
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
 document.body.style.overflow = '';
  }, [pathname]);

  const handleScroll = (e) => {
    savedSidebarScrollTop = e.currentTarget.scrollTop;
  };

  const handleNavigate = (key, path) => {
    setActiveScreen(key);
    router.push(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? '' : 'hidden';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/Login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Admin User';
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    if (user?.role?.name) return user.role.name;
    if (user?.is_superuser) return 'Super Administrator';
    if (user?.is_staff) return 'Staff Member';
    return 'User';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-black overflow-y-auto items-center justify-center">
        <div
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 13,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#C6A43F',
          }}
        >
          Loading…
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 3000,
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#000000',
            border: '1px solid rgba(198,164,63,0.4)',
            color: '#C6A43F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 2500,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-col h-full bg-black overflow-y-auto"
        style={{
          scrollBehavior: 'auto',
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile ? (isMobileMenuOpen ? 0 : '-100%') : 0,
          top: 0,
          zIndex: isMobile ? 2600 : 'auto',
          width: isMobile ? '280px' : '100%',
          transition: isMobile ? 'left 0.3s ease' : 'none',
        }}
      >
      {/* Logo */}
      <div className="px-6 py-8 border-b border-yellow-600/25 text-center bg-black">
        <div
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 17,
            letterSpacing: 3,
            background: 'linear-gradient(180deg, #E7C766 0%, #C6A43F 55%, #9C7C28 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 5,
            fontWeight: 600,
          }}
        >
          القرية الشعبية
        </div>
        <div
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 22,
            fontWeight: 600,
            background: 'linear-gradient(180deg, #F1D98A 0%, #C6A43F 50%, #A6852F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: 3,
            textShadow: '0 1px 12px rgba(198,164,63,0.25)',
          }}
        >
          The Heritage Village
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 6,
          }}
        >
          <span style={{ width: 14, height: 1, background: 'rgba(198,164,63,0.5)' }} />
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 11,
              color: '#C6A43F',
              letterSpacing: 2,
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            Est. 1998
          </span>
          <span style={{ width: 14, height: 1, background: 'rgba(198,164,63,0.5)' }} />
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#b1afaf',
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          Event & Hall Management
        </div>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 py-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <div
              style={{
                fontSize: 9.5,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
                color: '#8A7638',
                fontWeight: 600,
                padding: '16px 24px 6px',
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = activeScreen === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => handleNavigate(item.key, item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    padding: '11px 24px',
                    cursor: 'pointer',
                    fontSize: 13.5,
                    letterSpacing: 0.3,
                    color: isActive ? '#E8CD7A' : '#B8B8B8',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(198,164,63,0.16) 0%, rgba(198,164,63,0.04) 100%)'
                      : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive ? '2px solid #C6A43F' : '2px solid transparent',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#D8BD6E';
                      e.currentTarget.style.background = 'rgba(198,164,63,0.08)';
                      e.currentTarget.style.letterSpacing = '0.5px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#B8B8B8';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.letterSpacing = '0.3px';
                    }
                  }}
                >
                  <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.85 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              );
            })}
            {section.label === 'MAIN' && (
              <div style={{ borderTop: '1px solid rgba(198,164,63,0.15)', marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>

      {/* Bottom User Card + Logout */}
      <div style={{ padding: 16, borderTop: '1px solid rgba(198,164,63,0.25)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '10px 14px',
            background: '#111111',
            borderRadius: 12,
            marginBottom: 12,
            border: '1px solid rgba(198,164,63,0.3)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onClick={() => router.push('/admin/profile')}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(198,164,63,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(198,164,63,0.3)';
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(160deg, #E7C766 0%, #C6A43F 60%, #9C7C28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: 13.5,
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px rgba(198,164,63,0.35)',
            }}
          >
            {getUserInitials()}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#F0F0F0', letterSpacing: 0.2 }}>
              {getUserDisplayName()}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#C6A43F',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              {getUserRoleDisplay()}
            </div>
          </div>
        </div>
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            background: '#000000',
            borderRadius: 12,
            cursor: 'pointer',
            color: '#e08787',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.4,
            border: '1px solid rgba(217,83,79,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(217,83,79,0.1)';
            e.currentTarget.style.color = '#ff8f8f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#000000';
            e.currentTarget.style.color = '#e08787';
          }}
        >
          <span>🚪</span>
          <span>Logout / تسجيل الخروج</span>
        </div>
      </div>
    </div>
    </>
  );
}