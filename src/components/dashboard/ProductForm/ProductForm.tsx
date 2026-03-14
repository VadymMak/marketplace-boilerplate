"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import styles from "./ProductForm.module.css";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  initial?: {
    id: string;
    title: string;
    description: string;
    price: number;
    categoryId: string;
    status: string;
  };
};

export function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    price: initial?.price || "",
    categoryId: initial?.categoryId || categories[0]?.id || "",
    status: initial?.status || "DRAFT",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEdit ? `/api/products/${initial.id}` : "/api/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        id="title"
        name="title"
        label="Product Title"
        placeholder="e.g. Handmade Ceramic Mug"
        required
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
      />

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Describe your product..."
          className={styles.textarea}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <Input
        id="price"
        name="price"
        label="Price (€)"
        type="number"
        placeholder="0.00"
        required
        value={String(form.price)}
        onChange={(e) => update("price", e.target.value)}
      />

      <div className={styles.field}>
        <label htmlFor="categoryId" className={styles.label}>
          Category
        </label>
        <select
          id="categoryId"
          className={styles.select}
          value={form.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="status" className={styles.label}>
          Status
        </label>
        <select
          id="status"
          className={styles.select}
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
