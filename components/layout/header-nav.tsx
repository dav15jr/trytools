'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Instagram, Youtube, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error : any) {
      (`Error loggin out - ${error}: ${error.message}`)
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false);
      }
    }
    document.addEventListener('mouseover', handleClickOutside);
    return () => {
      document.removeEventListener('mouseover', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Header with social icons */}
      <div className="container mx-auto p-4 flex justify-center items-center">
        <div className="w-full flex justify-center">
          {/* Social media icons */}
          <div className="flex gap-4 items-center justify-center flex-grow">
            <Link
              href="https://www.instagram.com/tryumphcoaching/"
              target="_blank"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCQrSFWWbR3VcitIKnrrBkvw/featured"
              target="_blank"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Logo section */}
      <div className="container mx-auto px-4 py-6 text-center">
        <Image
          src="/Tryumph Coaching-header-01-01-01.png"
          alt="Tryumph Coaching Banner"
          width={300}
          height={100}
          className="mx-auto w-3/4 max-w-xs"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={toggleMenu}
              className="lg:hidden text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <ul
              className={`lg:flex lg:items-center font-semibold justify-center w-full gap-4 py-4 ${
                isMenuOpen
                  ? 'fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-4'
                  : 'hidden'
              } lg:relative lg:bg-transparent lg:space-y-0`}
            >
              {isMenuOpen && (
                <li className="lg:hidden absolute top-20 right-6">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </li>
              )}
             
                  <li className="text-center">
                    <Link
                      href={'/'}
                      className="block text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      HOME
                    </Link>
                  </li>
                  <li className="text-center">
                    <Link
                      href="/wheel-of-life"
                      className="block text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      WHEEL OF LIFE
                    </Link>
                  </li>
                  <li className="text-center">
                    <Link
                      href="/planner"
                      className="block text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      PLANNER
                    </Link>
                  </li>          
                  <li className="text-center">
                    <Link
                      href='https://tryumphcoaching.com/'
                      target="_blank"
                      className="block text-gray-700 hover:text-purple-600 transition-colors py-2 px-4 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      MAIN SITE
                    </Link>
                  </li>
            </ul>
            {user && (
              <div className="lg:ml-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="hover:bg-purple-600 hover:text-white transition-colors duration-200"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
