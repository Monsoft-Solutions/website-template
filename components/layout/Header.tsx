"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
}

interface DropdownItem {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    href: "/search",
    label: "Buy",
    dropdown: [
      { href: "/search", label: "Search Properties" },
      { href: "/buyer-resources", label: "Buyer Resources" },
      { href: "/neighborhoods", label: "Neighborhoods" },
    ],
  },
  {
    href: "/sell",
    label: "Sell",
    dropdown: [
      { href: "/home-valuation", label: "Home Valuation" },
      { href: "/seller-resources", label: "Seller Resources" },
      { href: "/market-analysis", label: "Market Analysis" },
    ],
  },
  {
    href: "/about",
    label: "About",
    dropdown: [
      { href: "/about/our-team", label: "Our Team" },
      { href: "/about/our-story", label: "Our Story" },
      { href: "/contact", label: "Contact" },
    ],
  },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95",
        isScrolled && "shadow-md"
      )}
    >
      <nav className="container flex h-20 md:h-20 items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <span className="text-primary-blue-dark font-headline text-2xl">
              Sun Gulf Realty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown && setActiveDropdown(item.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium font-body transition-colors hover:text-primary-blue-light",
                    pathname === item.href ||
                      pathname.startsWith(item.href.slice(0, -1))
                      ? "text-primary-blue-dark"
                      : "text-neutral-text"
                  )}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-border py-2 z-50">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-sm text-neutral-text hover:bg-secondary-light hover:text-primary-blue-dark transition-colors"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Phone & CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="tel:(239) 673-8733"
            className="flex items-center text-sm font-medium text-neutral-text hover:text-primary-blue-dark transition-colors"
          >
            <Phone className="mr-2 h-4 w-4" />
            (239) 673-8733
          </Link>
          <Button
            asChild
            className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2 font-medium"
          >
            <Link href="/home-valuation">Free Home Valuation</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white",
          isMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent",
                  pathname === item.href
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
              {/* Mobile Dropdown Items */}
              {item.dropdown && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.href}
                      href={dropdownItem.href}
                      className="block px-4 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Contact */}
          <div className="px-4 py-2 border-t border-neutral-border mt-4">
            <Link
              href="tel:(239) 673-8733"
              className="flex items-center text-sm font-medium text-neutral-text mb-2"
            >
              <Phone className="mr-2 h-4 w-4" />
              (239) 673-8733
            </Link>
            <Button
              asChild
              className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white"
            >
              <Link href="/home-valuation">Free Home Valuation</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
