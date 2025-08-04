import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api";

interface Customer {
  _id?: string;
  idCustomer?: string;
  phone: string;
  billingAddress: string;
  __v?: number;
}

export default function CustomerPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({ phone: "", billingAddress: "" });
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar todos los clientes
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerAPI.getAll();
      setCustomers(data);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron obtener los clientes", variant: "destructive" });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        idCustomer: `CUST_${Date.now()}`,
        phone: newCustomer.phone,
        billingAddress: newCustomer.billingAddress,
      };
      await customerAPI.create(data);
      toast({ title: "Cliente creado", description: "El cliente fue registrado correctamente" });
      setNewCustomer({ phone: "", billingAddress: "" });
      fetchCustomers();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer?._id) return;
    setLoading(true);
    try {
      await customerAPI.update(editCustomer._id, {
        phone: editCustomer.phone,
        billingAddress: editCustomer.billingAddress,
      });
      toast({ title: "Cliente actualizado", description: "Datos modificados correctamente" });
      setEditCustomer(null);
      fetchCustomers();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el cliente", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await customerAPI.delete(id);
      toast({ title: "Cliente eliminado", description: "El cliente fue eliminado correctamente" });
      fetchCustomers();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el cliente", variant: "destructive" });
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const data = await customerAPI.getById(searchId);
      if (data.message) {
        toast({ title: "No encontrado", description: "Cliente no existe", variant: "destructive" });
      } else {
        setCustomers([data]);
      }
    } catch {
      toast({ title: "Error", description: "No se pudo buscar el cliente", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cornsilk via-warm to-accent p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Gestión de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Crear Cliente */}
          <form onSubmit={handleCreate} className="space-y-4">
            <h2 className="font-bold">Crear Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Dirección de Facturación</Label>
                <Input
                  value={newCustomer.billingAddress}
                  onChange={(e) => setNewCustomer({ ...newCustomer, billingAddress: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-ceramics text-ceramics-foreground" disabled={loading}>
              {loading ? "Creando..." : "Crear Cliente"}
            </Button>
          </form>

          <Separator className="my-6" />

          {/* Editar Cliente */}
          {editCustomer && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <h2 className="font-bold">Editar Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={editCustomer.phone}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Dirección de Facturación</Label>
                  <Input
                    value={editCustomer.billingAddress}
                    onChange={(e) => setEditCustomer({ ...editCustomer, billingAddress: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="bg-ceramics text-ceramics-foreground" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Cliente"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditCustomer(null)}>Cancelar</Button>
            </form>
          )}

          <Separator className="my-6" />

          {/* Buscar Cliente */}
          <div className="flex space-x-2">
            <Input
              placeholder="Buscar por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button onClick={handleSearch}>Buscar</Button>
            <Button variant="outline" onClick={fetchCustomers}>Ver Todos</Button>
          </div>

          <Separator className="my-6" />

          {/* Lista de Clientes */}
          <h2 className="font-bold">Lista de Clientes</h2>
          <ul className="space-y-2 mt-4">
            {customers.map((c) => (
              <li key={c._id} className="flex justify-between items-center p-2 border rounded-lg">
                <div>
                  <p><strong>ID:</strong> {c._id}</p>
                  <p><strong>Teléfono:</strong> {c.phone}</p>
                  <p><strong>Dirección:</strong> {c.billingAddress}</p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => setEditCustomer(c)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id!)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
