"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Model Advisor",
    href: "/modeladvisor",
    description:
      "Get expert recommendations on the best AI models for your specific needs.",
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              <img
                src="/drel-logo.png"
                alt="Drel Solutions Logo"
                className="h-10 w-10 mr-2 rounded-lg"
              />
              <span className="hidden sm:inline">Drel Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), isLinkActive('/') ? "text-blue-600" : "")}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink
                     className={cn(navigationMenuTriggerStyle(), isLinkActive('/about') ? "text-blue-600" : "")}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a
                  href="https://drelsolutions.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] grid-cols-1">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden md:flex items-center space-x-4">
             <Link to="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700">Let's Talk</Button>
            </Link>
          </div>


          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                   <Link to="/" className="flex items-center text-xl font-bold text-gray-800" onClick={() => setIsOpen(false)}>
                      <img src="/drel-logo.png" alt="Drel Solutions Logo" className="h-8 w-8 mr-2 rounded-lg" />
                      Drel Solutions
                    </Link>
                </SheetHeader>
                <div className="mt-8 flex flex-col space-y-4">
                   <Link to="/" className="text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
                   <Link to="/about" className="text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>About</Link>
                   <a href="https://drelsolutions.substack.com/" target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-blue-600">Blog</a>
                   <Link to="/modeladvisor" className="text-lg font-medium hover:text-blue-600" onClick={() => setIsOpen(false)}>Model Advisor</Link>
                   <div className="pt-4">
                     <Link to="/contact">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsOpen(false)}>Let's Talk</Button>
                     </Link>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href || "/"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 