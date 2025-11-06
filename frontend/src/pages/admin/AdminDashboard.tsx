import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { useServices, type ServiceInput } from "@/context/ServicesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { storeGoogleMapsApiKey } from "@/components/MapGoogle";
import axios from "axios";
import CategoryEditableRow from "./CategoryEditableRow";
const AdminDashboard: React.FC = () => {
  const { services, categories, addService, updateService, deleteService, getAllServices } = useServices();
  const [editingId, setEditingId] = useState<string | null>(null);
const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");
  const [catSubTab, setCatSubTab] = useState<"list" | "manage">("manage");
  const [svcSearch, setSvcSearch] = useState("");
  const [svcSubTab, setSvcSubTab] = useState<"list" | "create">("list");
  const [svcPage, setSvcPage] = useState(1);
  const svcPageSize = 10;
  const [catName, setCatName] = useState("");
  const [serverCategories, setServerCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [catPage, setCatPage] = useState(1);
  const catPageSize = 10;
  const [form, setForm] = useState<ServiceInput>({
  name: "",
  description: "",
  location: "",
  // store category as id string for submission compatibility
  category: "",
  phone: "",
  website: "",
  coordinates: {
        lat: 7.3,
        lng: 8.3
      },
  rating: 4,
  tags: [],
  imageUrl: "",
  videoUrl: "",
});

  const [mapsKey, setMapsKey] = useState("");
  const [svcSaving, setSvcSaving] = useState(false);
  const navigate = useNavigate();

  // Check admin login
  useEffect(() => {
    const isAdmin = localStorage.getItem("discover-adama-admin") === "1";
    if (!isAdmin) navigate("/admin/login");
  }, [navigate]);

  // Fetch services on mount
  useEffect(() => {
    getAllServices();
  }, [getAllServices]);
  
  // Fetch categories from backend (for CRUD)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`);
        setServerCategories(data);
      } catch (e) {
        // ignore
      }
    };
    fetchCategories();
  }, []);
  
 // Count per category
const counts = useMemo(() => {
  const c: Record<string, number> = {};
  serverCategories.forEach((cat) => (c[cat._id] = 0));
  services.forEach((s) => {
    const catId = (s as any).category?._id ?? (s as any).category;
    if (catId) {
      c[catId] = (c[catId] ?? 0) + 1;
    }
  });
  return c;
}, [services, serverCategories]);

  

  // Sign out
  const signOut = async () => {
  axios.defaults.withCredentials = true;
  try {
    const { data } = await axios.post(`${API_URL}/auth/logout`);
    if (data.success) {
      toast({ title: "Logout", description: "Successfully logged out" });
      navigate("/admin/login");
    }
  } catch (error: any) {
    console.error(error.message);
    toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
  }
};


  // Submit form
  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setSvcSaving(true);
    const formData = new FormData();

    // Add all fields to FormData
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "imageUrl" && value instanceof File) {
          formData.append("images", value); // append to images[]
        } else if (key === "videoUrl" && value instanceof File) {
          formData.append("videos", value); // append to videos[]
        } else if (key === "coordinates") {
          // handled below
        } else if (key !== "imageUrl" && key !== "videoUrl") {
          formData.append(key, value as any);
        }
      }
    });

    // Add coordinates separately using bracket syntax for multer parsing
    formData.append("coordinates[lat]", String(form.coordinates.lat));
    formData.append("coordinates[lng]", String(form.coordinates.lng));

    if (editingId) {
      const { ok, error } = await updateService(editingId, form, formData);
      if (ok) {
        toast({ title: "Updated", description: "Service updated successfully" });
      } else {
        toast({ title: "Update failed", description: error || "Please check your inputs and try again", variant: "destructive" });
        return;
      }
    } else {
      const { ok, error } = await addService(form, formData);
      if (ok) {
        toast({ title: "Added", description: "Service added successfully" });
      } else {
        toast({ title: "Add failed", description: error || "Please check your inputs and try again", variant: "destructive" });
        return;
      }
    }

    // After create or update, navigate back to Services list subpage
    if (activeTab === "services") {
      setSvcSubTab("list");
    }

    // Reset form
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      location: "",
      category: serverCategories[0]?._id || "",
      phone: "",
      website: "",
      coordinates: {
        lat: 6.5,
        lng: 4.5
      },
      rating: 4,
      tags: [],
      imageUrl: "",
      videoUrl: "",
    });

  } catch (error) {
    toast({ title: "Error", description: "Failed to save service" });
  } finally {
    setSvcSaving(false);
  }
};


  // Set form for edit
  const setForEdit = (id: string) => {
    const svc = services.find((s) => s._id === id);
    if (!svc) return;
    setEditingId(id);
    setForm({
    name: svc.name,
    description: svc.description,
    location: svc.location,
    category: svc.category?._id || "", // use category id
    phone: svc.phone ?? "",
    website: svc.website ?? "",
    coordinates: {
        lat: svc.coordinates.lat,
        lng: svc.coordinates.lng
      },
    rating: svc.rating ?? 4,
    tags: svc.tags ?? [],
    imageUrl: "", // leave empty; user can upload a new one
    videoUrl: "", // leave empty
  });
};


  // Delete service
  const handleDelete = async (id: string) => {
    await deleteService(id);
    toast({ title: "Deleted", description: "Service deleted successfully" });
  };

  // Save Google Maps API key
  const saveMapsKey = () => {
    if (!mapsKey) return;
    storeGoogleMapsApiKey(mapsKey);
    setMapsKey("");
    toast({ title: "Google Maps Enabled", description: "Your API key has been stored locally." });
  };

  // Category CRUD handlers
  const createCategory = async () => {
    if (!catName.trim()) return;
    try {
      setCatLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${API_URL}/categories`, { name: catName });
      setServerCategories((prev) => [...prev, data]);
      setCatName("");
      toast({ title: "Category created" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed to create category", variant: "destructive" });
    } finally {
      setCatLoading(false);
    }
  };

  const deleteCategoryApi = async (id: string) => {
    try {
      setCatLoading(true);
      axios.defaults.withCredentials = true;
      await axios.delete(`${API_URL}/categories/${id}`);
      setServerCategories((prev) => prev.filter((c) => c._id !== id));
      toast({ title: "Category deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed to delete category", variant: "destructive" });
    } finally {
      setCatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Admin Dashboard — Discover Adama</title>
        <meta name="description" content="Manage service listings and settings for Discover Adama." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <SiteHeader />

      <main className="container mx-auto flex-1 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 border border-slate-200 rounded-md p-3 h-fit bg-white shadow-sm">
            <div className="font-semibold mb-2 text-slate-800">Admin</div>
            <div className="grid gap-2">
              <Button 
                variant={activeTab === "services" ? "default" : "secondary"} 
                onClick={() => { setActiveTab("services"); setSvcSubTab("list"); }}
                className={activeTab === "services" ? "bg-sky-500 hover:bg-sky-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
              >
                Services
              </Button>
              <Button 
                variant={activeTab === "categories" ? "default" : "secondary"} 
                onClick={() => { setActiveTab("categories"); setCatSubTab("manage"); }}
                className={activeTab === "categories" ? "bg-sky-500 hover:bg-sky-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
              >
                Categories
              </Button>
            </div>
            <div className="mt-6 grid gap-2">
              <Input placeholder="Google Maps API Key" value={mapsKey} onChange={(e) => setMapsKey(e.target.value)} className="w-full border-slate-300" />
              <Button variant="secondary" onClick={saveMapsKey} className="bg-amber-500 hover:bg-amber-600 text-white">Save Maps Key</Button>
              <Button variant="outline" onClick={signOut} className="border-slate-300 text-slate-700 hover:bg-slate-100">Sign out</Button>
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1 space-y-6">
            {/* Categories subpages */}
            {activeTab === "categories" && (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <Button variant={catSubTab === "list" ? "default" : "secondary"} onClick={() => setCatSubTab("list")}>List</Button>
                    <Button variant={catSubTab === "manage" ? "default" : "secondary"} onClick={() => setCatSubTab("manage")}>Manage</Button>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Search categories..."
                      value={catSearch}
                      onChange={(e) => { setCatSearch(e.target.value); setCatPage(1); }}
                      className="w-64"
                    />
                  </div>
                </div>

                {catSubTab === "list" && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {serverCategories
                      .filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                      .map((cat) => (
                      <Card key={cat._id} className="hover:shadow-elegant transition-shadow">
                        <CardHeader><CardTitle className="text-base">{cat.name}</CardTitle></CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{counts[cat._id] ?? 0}</div>
                          <div className="text-xs text-muted-foreground">Total listings</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {catSubTab === "manage" && (
                  <section className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle>Categories</CardTitle>
                          <Input
                            placeholder="Search categories..."
                            value={catSearch}
                            onChange={(e) => { setCatSearch(e.target.value); setCatPage(1); }}
                            className="w-64"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 pb-4">
                          <Input placeholder="New category name" value={catName} onChange={(e) => setCatName(e.target.value)} className="border-slate-300" />
                          <Button onClick={createCategory} disabled={catLoading} className="bg-sky-500 hover:bg-sky-600 text-white">Add</Button>
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {serverCategories
                                .filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                                .slice((catPage - 1) * catPageSize, catPage * catPageSize)
                                .map((c) => (
                                <TableRow key={c._id}>
                                  <TableCell className="font-medium">
                                    <CategoryEditableRow key={c._id} category={c} onUpdated={(updated) => setServerCategories((prev) => prev.map((x) => x._id === updated._id ? updated : x))} />
                                  </TableCell>
                                  <TableCell>
                                    <Button size="sm" variant="destructive" onClick={() => deleteCategoryApi(c._id)} disabled={catLoading}>Delete</Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-4">
                          {(() => {
                            const total = serverCategories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase())).length;
                            const totalPages = Math.max(1, Math.ceil(total / catPageSize));
                            const pages: number[] = [];
                            const startPage = Math.max(1, catPage - 2);
                            const endPage = Math.min(totalPages, catPage + 2);
                            if (startPage > 1) pages.push(1);
                            if (startPage > 2) pages.push(-1);
                            for (let p = startPage; p <= endPage; p++) pages.push(p);
                            if (endPage < totalPages - 1) pages.push(-1);
                            if (endPage < totalPages) pages.push(totalPages);
                            return (
                              <>
                                <span className="text-sm text-muted-foreground">Page {catPage} of {totalPages}</span>
                                <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={catPage === 1} onClick={() => setCatPage(1)}>First</Button>
                                <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={catPage === 1} onClick={() => setCatPage((p) => Math.max(1, p - 1))}>Prev</Button>
                                {pages.map((p, idx) => p === -1 ? (
                                  <span key={`ce-${idx}`} className="px-2 text-muted-foreground">…</span>
                                ) : (
                                  <Button type="button" key={p} size="sm" variant={p === catPage ? "default" : "ghost"} className={`rounded-full ${p === catPage ? "" : "hover:bg-muted"}`} onClick={() => setCatPage(p)}>{p}</Button>
                                ))}
                                <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={catPage === totalPages} onClick={() => setCatPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                                <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={catPage === totalPages} onClick={() => setCatPage(totalPages)}>Last</Button>
                              </>
                            );
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}
              </section>
            )}

            {activeTab === "services" && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant={svcSubTab === "list" ? "default" : "secondary"} onClick={() => setSvcSubTab("list")}>List</Button>
                  <Button variant={svcSubTab === "create" ? "default" : "secondary"} onClick={() => { setSvcSubTab("create"); setEditingId(null); }}>Create</Button>
                </div>

                {svcSubTab === "list" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>All Services</CardTitle>
                      <div className="flex gap-2 items-center">
                        <Input placeholder="Search services..." value={svcSearch} onChange={(e) => { setSvcSearch(e.target.value); setSvcPage(1); }} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Address</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {services
                              .filter((s) => `${s.name} ${s.location} ${s.category?.name ?? ""}`.toLowerCase().includes(svcSearch.toLowerCase()))
                              .slice((svcPage - 1) * svcPageSize, svcPage * svcPageSize)
                              .map((s) => (
                              <TableRow key={s._id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.category?.name}</TableCell>
                                <TableCell>{s.location}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => { setSvcSubTab("create"); setForEdit(s._id); }}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(s._id)}>Delete</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-4">
                        {(() => {
                          const total = services.filter((s) => `${s.name} ${s.location} ${s.category?.name ?? ""}`.toLowerCase().includes(svcSearch.toLowerCase())).length;
                          const totalPages = Math.max(1, Math.ceil(total / svcPageSize));
                          const pages: number[] = [];
                          const startPage = Math.max(1, svcPage - 2);
                          const endPage = Math.min(totalPages, svcPage + 2);
                          if (startPage > 1) pages.push(1);
                          if (startPage > 2) pages.push(-1);
                          for (let p = startPage; p <= endPage; p++) pages.push(p);
                          if (endPage < totalPages - 1) pages.push(-1);
                          if (endPage < totalPages) pages.push(totalPages);
                          return (
                            <>
                              <span className="text-sm text-muted-foreground">Page {svcPage} of {totalPages}</span>
                              <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={svcPage === 1} onClick={() => setSvcPage(1)}>First</Button>
                              <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={svcPage === 1} onClick={() => setSvcPage((p) => Math.max(1, p - 1))}>Prev</Button>
                              {pages.map((p, idx) => p === -1 ? (
                                <span key={`e-${idx}`} className="px-2 text-muted-foreground">…</span>
                              ) : (
                                <Button type="button" key={p} size="sm" variant={p === svcPage ? "default" : "ghost"} className={`rounded-full ${p === svcPage ? "" : "hover:bg-muted"}`} onClick={() => setSvcPage(p)}>{p}</Button>
                              ))}
                              <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={svcPage === totalPages} onClick={() => setSvcPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                              <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={svcPage === totalPages} onClick={() => setSvcPage(totalPages)}>Last</Button>
                            </>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {svcSubTab === "create" && (
                  <Card>
                    <CardHeader><CardTitle>{editingId ? "Edit Service" : "Add New Service"}</CardTitle></CardHeader>
                    <CardContent>
                      <form className="space-y-3" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={form.category as unknown as string} onValueChange={(v) => setForm({ ...form, category: v as any })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                             {serverCategories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}                          </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address/Location</Label>
                            <Input id="address" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="lat">Latitude</Label>
                              <Input id="lat" type="number" value={String(form.coordinates.lat)} onChange={(e) => setForm({ ...form, coordinates: {...form.coordinates, lat: parseFloat(e.target.value),}, })} required />
                              
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lng">Longitude</Label>
                              <Input id="lng" type="number" value={String(form.coordinates.lng)} onChange={(e) => setForm({ ...form, coordinates:{...form.coordinates, lng:parseFloat(e.target.value)} })} required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input id="rating" type="number" min={1} max={5} value={form.rating ?? 0} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                          </div>
                         <div className="space-y-2">
  <Label htmlFor="image">Upload Image</Label>
  <Input 
    id="image" 
    type="file" 
    accept="image/*" 
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) setForm({ ...form, imageUrl: file as any }); 
    }} 
  />
</div>
                         <div className="space-y-2">
  <Label htmlFor="video">Upload Video</Label>
  <Input 
    id="video" 
    type="file" 
    accept="video/*" 
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) setForm({ ...form, videoUrl: file as any }); 
    }} 
  />
</div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button type="submit" disabled={svcSaving} className="bg-sky-500 hover:bg-sky-600 text-white">
                            {svcSaving ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save Changes" : "Add Service")}
                          </Button>
                          {editingId && (
                            <Button variant="secondary" type="button" onClick={() => setEditingId(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700">Cancel</Button>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {false}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AdminDashboard;
