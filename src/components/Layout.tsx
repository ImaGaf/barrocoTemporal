import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Search, Menu, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cartStore } from "@/lib/cart-store";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartStore.getCount());
    };

    updateCartCount();
    const unsubscribe = cartStore.subscribe(updateCartCount);
    return unsubscribe;
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ceramics rounded-lg flex items-center justify-center">
                <span className="text-ceramics-foreground font-bold">B</span>
              </div>
              <span className="text-xl font-bold text-foreground">Barroco Ceramics</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Inicio
              </Link>
              <Link 
                to="/productos" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/productos') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Productos
              </Link>
              <Link 
                to="/categorias" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/categorias') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Categorías
              </Link>
              <Link 
                to="/personalizar" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/personalizar') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Personalizar
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
              </Button>

              {/* Cart */}
              <Link to="/carrito">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-ceramics text-ceramics-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User */}
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </Link>

              {/* Mobile menu */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Sobre Nosotros</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Creamos cerámicas artesanales personalizadas con amor y dedicación. 
                Cada pieza es única y especial.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/productos" className="text-muted-foreground hover:text-primary">Productos</Link></li>
                <li><Link to="/personalizar" className="text-muted-foreground hover:text-primary">Personalizar</Link></li>
                <li><Link to="/sobre-nosotros" className="text-muted-foreground hover:text-primary">Sobre Nosotros</Link></li>
                <li><Link to="/contacto" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Atención al Cliente</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/ayuda" className="text-muted-foreground hover:text-primary">Centro de Ayuda</Link></li>
                <li><Link to="/envios" className="text-muted-foreground hover:text-primary">Envíos</Link></li>
                <li><Link to="/devoluciones" className="text-muted-foreground hover:text-primary">Devoluciones</Link></li>
                <li><Link to="/politicas" className="text-muted-foreground hover:text-primary">Políticas</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: info@barrococeramics.com</p>
                <p>Teléfono: +1 234 567 8900</p>
                <p>Horario: Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2024 Barroco Ceramics. Todos los derechos reservados.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link to="/privacidad" className="text-muted-foreground hover:text-primary text-sm">
                  Privacidad
                </Link>
                <Link to="/terminos" className="text-muted-foreground hover:text-primary text-sm">
                  Términos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}