import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, Utensils, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Начало", icon: Home },
    { href: "/recipes", label: "Рецепти", icon: Utensils },
    { href: "/add-recipe", label: "Добави рецепта", icon: Plus },
    { href: "/contact", label: "Контакти", icon: Mail },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-dancing text-3xl text-warm-orange font-semibold cursor-pointer">
                ЖиГулИ рецепти
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      isActive(href)
                        ? "text-warm-orange font-medium"
                        : "text-gray-700 hover:text-warm-orange"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-3 py-2 ${
                          isActive(href)
                            ? "text-warm-orange font-medium bg-warm-orange/10"
                            : "text-gray-700 hover:text-warm-orange"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
