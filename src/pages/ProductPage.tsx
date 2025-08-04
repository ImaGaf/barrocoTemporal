import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { productAPI } from "@/lib/api";

export default function ProductPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(""); 
  const [editingProduct, setEditingProduct] = useState<{ id: string; price: number; stock: number } | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      await productAPI.update(editingProduct.id, {
        price: editingProduct.price,
        stock: editingProduct.stock,
      });
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido modificado correctamente",
      });
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cornsilk via-warm to-accent p-6">
      <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Buscador */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar producto por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lista de productos */}
          {filteredProducts.length > 0 ? (
            <ul className="space-y-3">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  className={`border p-4 rounded-md ${
                    product.stock === 0 ? "border-red-500 bg-red-100" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {product.url && (
                      <img
                        src={product.url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}

                    <div className="flex-1">
                      <p><strong>ID Producto:</strong> {product.idProduct}</p>
                      <p><strong>Nombre:</strong> {product.name}</p>
                      <p><strong>Descripción:</strong> {product.description}</p>
                      <p><strong>Precio:</strong> ${product.price}</p>
                      <p>
                        <strong>Stock:</strong>{" "}
                        <span className={product.stock === 0 ? "text-red-600 font-bold" : ""}>
                          {product.stock}
                        </span>
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setEditingProduct({
                          id: product._id,
                          price: product.price,
                          stock: product.stock,
                        })
                      }
                    >
                      Editar
                    </Button>
                  </div>

                  {editingProduct?.id === product._id && (
                    <div className="mt-4 p-3 border rounded-md bg-muted">
                      <h3 className="text-sm font-semibold mb-2">Actualizar Producto</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">Precio</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Stock</label>
                          <Input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          className="bg-ceramics hover:bg-ceramics/90 text-ceramics-foreground"
                          onClick={handleUpdate}
                        >
                          Guardar cambios
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No se encontraron productos</p>
          )}

          <Separator className="my-6" />
        </CardContent>
      </Card>
    </div>
  );
}
