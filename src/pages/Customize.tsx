import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Palette, Ruler, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cartStore } from "@/lib/cart-store";

interface CustomizationOptions {
  productType: string;
  color: string;
  size: string;
  design: string;
  glaze: string;
  quantity: number;
  personalMessage?: string;
}

export default function Customize() {
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    productType: "",
    color: "",
    size: "",
    design: "",
    glaze: "",
    quantity: 1,
    personalMessage: "",
  });

  const productTypes = [
    { id: "mug", name: "Taza", price: 24.99, icon: "☕" },
    { id: "plate", name: "Plato", price: 35.50, icon: "🍽️" },
    { id: "vase", name: "Jarrón", price: 45.00, icon: "🏺" },
    { id: "bowl", name: "Cuenco", price: 28.99, icon: "🥣" },
  ];

  const colors = [
    { id: "sage", name: "Verde Salvia", hex: "#A6C3AD" },
    { id: "ash", name: "Ceniza", hex: "#B9CCAE" },
    { id: "tea", name: "Verde Té", hex: "#CCD5AE" },
    { id: "beige", name: "Beige", hex: "#E9EDC9" },
    { id: "warm", name: "Cálido", hex: "#FAEDCD" },
    { id: "buff", name: "Ocre", hex: "#D3A373" },
  ];

  const sizes = [
    { id: "small", name: "Pequeño", multiplier: 0.8 },
    { id: "medium", name: "Mediano", multiplier: 1.0 },
    { id: "large", name: "Grande", multiplier: 1.3 },
    { id: "xl", name: "Extra Grande", multiplier: 1.6 },
  ];

  const designs = [
    { id: "minimal", name: "Minimalista", price: 0 },
    { id: "floral", name: "Floral", price: 5 },
    { id: "geometric", name: "Geométrico", price: 8 },
    { id: "mandala", name: "Mandala", price: 12 },
    { id: "custom", name: "Diseño Personalizado", price: 20 },
  ];

  const glazes = [
    { id: "matte", name: "Mate", price: 0 },
    { id: "glossy", name: "Brillante", price: 3 },
    { id: "metallic", name: "Metálico", price: 8 },
    { id: "crackle", name: "Craquelado", price: 10 },
  ];

  const calculatePrice = () => {
    const baseProduct = productTypes.find(p => p.id === customization.productType);
    const selectedSize = sizes.find(s => s.id === customization.size);
    const selectedDesign = designs.find(d => d.id === customization.design);
    const selectedGlaze = glazes.find(g => g.id === customization.glaze);

    if (!baseProduct || !selectedSize || !selectedDesign || !selectedGlaze) return 0;

    const basePrice = baseProduct.price * selectedSize.multiplier;
    const designPrice = selectedDesign.price;
    const glazePrice = selectedGlaze.price;

    return (basePrice + designPrice + glazePrice) * customization.quantity;
  };

  const addToCart = () => {
    if (!customization.productType || !customization.color || !customization.size) {
      toast({
        title: "Personalización incompleta",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = productTypes.find(p => p.id === customization.productType);
    const finalPrice = calculatePrice();

    const cartItem = {
      id: `custom-${Date.now()}`,
      productId: `custom-${customization.productType}`,
      name: `${selectedProduct?.name} Personalizada`,
      price: finalPrice / customization.quantity,
      quantity: customization.quantity,
      customization: {
        productType: customization.productType,
        color: colors.find(c => c.id === customization.color)?.name,
        size: sizes.find(s => s.id === customization.size)?.name,
        design: designs.find(d => d.id === customization.design)?.name,
        glaze: glazes.find(g => g.id === customization.glaze)?.name,
      }
    };

    cartStore.addItem(cartItem);

    toast({
      title: "Producto personalizado agregado",
      description: "Tu pieza única ha sido añadida al carrito",
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-cornsilk to-warm py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/productos">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Personalizar Producto</h1>
                <p className="text-muted-foreground">Crea tu pieza única paso a paso</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Paso {step} de 4
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customization Steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Product Type */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-ceramics" />
                    Elige tu Producto
                  </CardTitle>
                  <CardDescription>
                    Selecciona el tipo de cerámica que quieres personalizar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productTypes.map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          customization.productType === product.id
                            ? "ring-2 ring-ceramics bg-ceramics/5"
                            : ""
                        }`}
                        onClick={() => setCustomization(prev => ({ ...prev, productType: product.id }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl mb-2">{product.icon}</div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Color & Size */}
            {step === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-ceramics" />
                      Color y Acabado
                    </CardTitle>
                    <CardDescription>
                      Elige el color que más te guste de nuestra paleta artesanal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${
                            customization.color === color.id
                              ? "border-ceramics"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => setCustomization(prev => ({ ...prev, color: color.id }))}
                        >
                          <div
                            className="w-full h-12 rounded-md mb-2"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <p className="text-xs text-center font-medium">{color.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ruler className="h-5 w-5 mr-2 text-ceramics" />
                      Tamaño
                    </CardTitle>
                    <CardDescription>
                      Selecciona el tamaño perfecto para tu necesidad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sizes.map((size) => (
                        <Card
                          key={size.id}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            customization.size === size.id
                              ? "ring-2 ring-ceramics bg-ceramics/5"
                              : ""
                          }`}
                          onClick={() => setCustomization(prev => ({ ...prev, size: size.id }))}
                        >
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold">{size.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {size.multiplier}x precio base
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Design & Finish */}
            {step === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Diseño Decorativo</CardTitle>
                    <CardDescription>
                      Añade un toque artístico a tu pieza
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {designs.map((design) => (
                        <div
                          key={design.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            customization.design === design.id
                              ? "border-ceramics bg-ceramics/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => setCustomization(prev => ({ ...prev, design: design.id }))}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{design.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {design.price === 0 ? "Incluido" : `+$${design.price}`}
                              </p>
                            </div>
                            {customization.design === design.id && (
                              <Badge className="bg-ceramics">Seleccionado</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Acabado de Esmalte</CardTitle>
                    <CardDescription>
                      Define el acabado final de tu cerámica
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {glazes.map((glaze) => (
                        <div
                          key={glaze.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            customization.glaze === glaze.id
                              ? "border-ceramics bg-ceramics/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          onClick={() => setCustomization(prev => ({ ...prev, glaze: glaze.id }))}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{glaze.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {glaze.price === 0 ? "Incluido" : `+$${glaze.price}`}
                              </p>
                            </div>
                            {customization.glaze === glaze.id && (
                              <Badge className="bg-ceramics">Seleccionado</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Final Details */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles Finales</CardTitle>
                  <CardDescription>
                    Ajusta la cantidad y añade un mensaje personal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <div className="mt-2">
                      <Slider
                        value={[customization.quantity]}
                        onValueChange={([value]) => setCustomization(prev => ({ ...prev, quantity: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1</span>
                        <span className="font-semibold">Cantidad: {customization.quantity}</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold mb-4">Resumen de tu Personalización</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Producto:</span>
                        <span>{productTypes.find(p => p.id === customization.productType)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span>{colors.find(c => c.id === customization.color)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tamaño:</span>
                        <span>{sizes.find(s => s.id === customization.size)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diseño:</span>
                        <span>{designs.find(d => d.id === customization.design)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Acabado:</span>
                        <span>{glazes.find(g => g.id === customization.glaze)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span>{customization.quantity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  className="bg-ceramics hover:bg-ceramics/90 text-ceramics-foreground"
                  disabled={
                    (step === 1 && !customization.productType) ||
                    (step === 2 && (!customization.color || !customization.size)) ||
                    (step === 3 && (!customization.design || !customization.glaze))
                  }
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={addToCart}
                  className="bg-ceramics hover:bg-ceramics/90 text-ceramics-foreground"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar al Carrito
                </Button>
              )}
            </div>
          </div>

          {/* Preview & Price */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Product Preview */}
                <div className="aspect-square bg-gradient-to-br from-accent to-warm rounded-lg flex items-center justify-center text-6xl mb-4">
                  {productTypes.find(p => p.id === customization.productType)?.icon || "🏺"}
                </div>

                {/* Selected Options */}
                {customization.color && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ 
                          backgroundColor: colors.find(c => c.id === customization.color)?.hex 
                        }}
                      ></div>
                      <span className="text-sm">{colors.find(c => c.id === customization.color)?.name}</span>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Price */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-ceramics mb-2">
                    ${calculatePrice().toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Precio total ({customization.quantity} {customization.quantity === 1 ? 'pieza' : 'piezas'})
                  </p>
                </div>

                {step === 4 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      🕒 Tiempo de producción: 7-10 días hábiles
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}