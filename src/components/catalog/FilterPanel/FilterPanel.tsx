"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import styles from "./FilterPanel.module.css";

type Category = { id: string; name: string; slug: string };

type FilterPanelProps = {
  categories: Category[];
};

export function FilterPanel({ categories }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <aside className={styles.panel}>
      <div className={styles.group}>
        <h3 className={styles.label}>Category</h3>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${!searchParams.get("category") ? styles.active : ""}`}
            onClick={() => updateParam("category", "")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.option} ${searchParams.get("category") === cat.slug ? styles.active : ""}`}
              onClick={() => updateParam("category", cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.label}>Sort by</h3>
        <select
          className={styles.select}
          value={searchParams.get("sort") || "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className={styles.group}>
        <h3 className={styles.label}>Price range</h3>
        <div className={styles.priceRow}>
          <input
            type="number"
            placeholder="Min"
            className={styles.priceInput}
            defaultValue={searchParams.get("minPrice") || ""}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Max"
            className={styles.priceInput}
            defaultValue={searchParams.get("maxPrice") || ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
          />
        </div>
      </div>
    </aside>
  );
}
