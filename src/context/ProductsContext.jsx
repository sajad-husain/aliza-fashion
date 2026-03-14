import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products as staticProducts, categories as staticCategories } from "../data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const ProductsContext = createContext();

const formatPrice = (value) => {
  if (!value && value !== 0) return "Rs. 0";
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (!isNaN(num)) return `Rs. ${num.toLocaleString()}`;
    return value;
  }
  if (typeof value === "number") return `Rs. ${value.toLocaleString()}`;
  return "Rs. 0";
};

const normalizeProduct = (row) => ({
  id: row.id,
  name: row.name,
  price: formatPrice(row.price),
  image: row.image || row.image_url || "",
  category: row.category,
  fabric: row.fabric,
  length: row.length,
  care: row.care,
  description: row.description,
  inStock: row.in_stock ?? true,
});

const deriveCategories = (items) => {
  const unique = [...new Set(items.map((item) => item.category).filter(Boolean))];
  return unique.map((name, idx) => ({ id: idx + 1, name, image: items.find((p) => p.category === name)?.image || "" }));
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(staticProducts);
  const [categories, setCategories] = useState(staticCategories);
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadProducts = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("timeout")), 3000)
    );

    try {
      const fetchPromise = supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const data = result && typeof result === 'object' ? result.data : null;
      const error = result && typeof result === 'object' ? result.error : null;

      if (error || !data || data.length === 0) return;

      const normalized = data.map(normalizeProduct);
      setProducts(normalized);
      setCategories(deriveCategories(normalized));
    } catch (err) {
      console.warn("Products load error:", err);
    }
  };

  const refreshProducts = async () => {
    setLoading(true);
    await loadProducts();
    setLoading(false);
  };

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadProducts();
  }, []);

  const value = useMemo(
    () => ({ products, categories, loading, refreshProducts }),
    [products, categories, loading]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
};
