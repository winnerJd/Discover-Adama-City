import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryEditableRow: React.FC<{
  category: { _id: string; name: string };
  onUpdated: (c: { _id: string; name: string }) => void;
}> = ({ category, onUpdated }) => {
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || name === category.name) return;
    try {
      setSaving(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${API_URL}/categories/${category._id}`, { name });
      // Backend returns { message, category }
      onUpdated(data.category ?? data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button size="sm" variant="secondary" disabled={saving || name === category.name} onClick={save}>Edit Category</Button>
    </div>
  );
};

export default CategoryEditableRow;


