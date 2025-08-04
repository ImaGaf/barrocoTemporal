import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { orderAPI } from "@/lib/api"; // Asegúrate de que tenga getAll incluido

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<{ id: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener todas las órdenes
  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll();
      console.log("Órdenes recibidas:", data);

      // Validar que sea un array
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes",
        variant: "destructive",
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Actualizar estatus
  const handleUpdate = async () => {
    if (!editingOrder) return;
    try {
      await orderAPI.update(editingOrder.id, { status: editingOrder.status });
      toast({
        title: "Orden actualizada",
        description: "El estatus ha sido modificado correctamente",
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error al actualizar orden:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la orden",
        variant: "destructive",
      });
    }
  };

  // Filtrar por búsqueda
  const filteredOrders = orders.filter((order) => {
    const idOrder = order.idOrder?.toLowerCase() || "";
    const products = order.products?.toLowerCase() || "";
    return idOrder.includes(search.toLowerCase()) || products.includes(search.toLowerCase());
  });

  // Color por estatus
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "entregado":
        return "bg-green-100 border-green-500";
      case "cancelado":
        return "bg-red-100 border-red-500";
      case "en proceso":
        return "bg-yellow-100 border-yellow-500";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  // Renderizar
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cornsilk via-warm to-accent p-6">
      <Card className="max-w-5xl mx-auto bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Buscador */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Buscar por ID o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lista de órdenes */}
          {filteredOrders.length > 0 ? (
            <ul className="space-y-3">
              {filteredOrders.map((order) => {
                const formattedDate = order.date
                  ? new Date(order.date).toLocaleDateString()
                  : "Sin fecha";

                return (
                  <li
                    key={order._id || order.idOrder}
                    className={`border p-4 rounded-md ${getStatusColor(order.status)}`}
                  >
                    <p><strong>ID Orden:</strong> {order.idOrder || "Sin ID"}</p>
                    <p><strong>Productos:</strong> {order.products || "Sin productos"}</p>
                    <p><strong>Total:</strong> ${order.total ?? "N/A"}</p>
                    <p><strong>Dirección:</strong> {order.deliveryAddress || "Sin dirección"}</p>
                    <p><strong>Fecha:</strong> {formattedDate}</p>
                    <p><strong>Cliente:</strong> {order.customer || "Sin cliente"}</p>
                    <p><strong>Estatus:</strong> {order.status || "Desconocido"}</p>

                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        setEditingOrder({
                          id: order._id || order.idOrder,
                          status: order.status || "En proceso",
                        })
                      }
                    >
                      Editar Estatus
                    </Button>

                    {/* Formulario de edición */}
                    {editingOrder?.id === (order._id || order.idOrder) && (
                      <div className="mt-4 p-3 border rounded-md bg-muted">
                        <h3 className="text-sm font-semibold mb-2">Actualizar Estatus</h3>
                        <select
                          className="border p-2 rounded-md w-full"
                          value={editingOrder.status}
                          onChange={(e) =>
                            setEditingOrder({ ...editingOrder, status: e.target.value })
                          }
                        >
                          <option value="En proceso">En proceso</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>

                        <div className="flex gap-2 mt-3">
                          <Button
                            className="bg-ceramics hover:bg-ceramics/90 text-ceramics-foreground"
                            onClick={handleUpdate}
                          >
                            Guardar cambios
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setEditingOrder(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground">No se encontraron órdenes</p>
          )}

          <Separator className="my-6" />
        </CardContent>
      </Card>
    </div>
  );
}
