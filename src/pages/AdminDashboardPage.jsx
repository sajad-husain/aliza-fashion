import { useMemo, useState, useEffect } from "react";
import { FiImage, FiPlusCircle, FiPackage, FiShoppingBag, FiCheck, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { useProducts } from "../context/ProductsContext";

const initialState = {
  name: "",
  price: "",
  category: "Women",
  fabric: "",
  length: "",
  care: "",
  description: "",
  inStock: true,
};

const sanitizeFileName = (name) => name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");

const AdminDashboardPage = () => {
  const { categories, products, refreshProducts } = useProducts();
  const [activeTab, setActiveTab] = useState("products");
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageInputKey, setImageInputKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setOrders(data);
        }
      } else {
        const savedOrders = JSON.parse(localStorage.getItem("aliza-orders") || "[]");
        setOrders(savedOrders.reverse());
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", orderId);
        
        if (error) throw error;
      } else {
        const savedOrders = JSON.parse(localStorage.getItem("aliza-orders") || "[]");
        const updatedOrders = savedOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem("aliza-orders", JSON.stringify(updatedOrders));
      }
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const parsePrice = (price) => {
    if (!price) return "";
    if (typeof price === "number") return price.toString();
    const num = parseFloat(price.replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? "" : num.toString();
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      price: parsePrice(product.price),
      category: product.category,
      fabric: product.fabric || "",
      length: product.length || "",
      care: product.care || "",
      description: product.description || "",
      inStock: product.in_stock,
    });
    setEditImageFile(null);
    setEditPreviewUrl(product.image || "");
    setImageRemoved(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm(null);
    setEditImageFile(null);
    setEditPreviewUrl("");
    setImageRemoved(false);
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditPreviewUrl("");
    setImageRemoved(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    setEditPreviewUrl(file ? URL.createObjectURL(file) : "");
    if (file) setImageRemoved(false);
  };

  const saveProduct = async (productId) => {
    if (!editForm) return;

    const numericPrice = Number(editForm.price);
    if (!numericPrice || isNaN(numericPrice)) {
      setStatus({ type: "error", message: "Please enter a valid price." });
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = null;

      if (imageRemoved) {
        imageUrl = null;
      } else if (editImageFile) {
        const bucketName = import.meta.env.VITE_SUPABASE_PRODUCTS_BUCKET || "product-images";
        const extension = editImageFile.name.split(".").pop() || "jpg";
        const filePath = `products/${Date.now()}-${sanitizeFileName(editForm.name)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, editImageFile, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        imageUrl = publicData.publicUrl;
      } else if (editPreviewUrl) {
        imageUrl = editPreviewUrl;
      }

      const payload = {
        name: editForm.name,
        price: numericPrice,
        image: imageUrl,
        category: editForm.category,
        fabric: editForm.fabric || null,
        length: editForm.length || null,
        care: editForm.care || null,
        description: editForm.description || null,
        in_stock: editForm.inStock,
      };

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
      } else {
        const savedProducts = JSON.parse(localStorage.getItem("aliza-products") || "[]");
        const updatedProducts = savedProducts.map(p => 
          p.id === productId ? { ...p, ...payload } : p
        );
        localStorage.setItem("aliza-products", JSON.stringify(updatedProducts));
      }

      if (refreshProducts) await refreshProducts();
      cancelEdit();
      setStatus({ type: "success", message: "Product updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Failed to update product." });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) throw error;
      } else {
        const savedProducts = JSON.parse(localStorage.getItem("aliza-products") || "[]");
        const updatedProducts = savedProducts.filter(p => p.id !== productId);
        localStorage.setItem("aliza-products", JSON.stringify(updatedProducts));
      }

      if (refreshProducts) await refreshProducts();
      setStatus({ type: "success", message: "Product deleted successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Failed to delete product." });
    }
  };

  const categoryOptions = useMemo(() => {
    const names = categories.map((item) => item.name).filter(Boolean);
    return names.length > 0 ? names : ["Women", "Men", "Kids"];
  }, [categories]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const removeNewImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setImageInputKey((prev) => prev + 1);
  };

  const resetForm = () => {
    setForm(initialState);
    setImageFile(null);
    setPreviewUrl("");
    setImageInputKey((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        type: "error",
        message: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      });
      return;
    }

    if (!imageFile) {
      setStatus({ type: "error", message: "Please select a product image." });
      return;
    }

    const numericPrice = Number(form.price);
    if (!numericPrice || Number.isNaN(numericPrice)) {
      setStatus({ type: "error", message: "Please enter a valid numeric price." });
      return;
    }

    setIsSaving(true);

    try {
      const bucketName = import.meta.env.VITE_SUPABASE_PRODUCTS_BUCKET || "product-images";
      const extension = imageFile.name.split(".").pop() || "jpg";
      const filePath = `products/${Date.now()}-${sanitizeFileName(form.name)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, imageFile, { upsert: false });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      const payload = {
        name: form.name,
        price: numericPrice,
        image: publicData.publicUrl,
        category: form.category,
        fabric: form.fabric,
        length: form.length,
        care: form.care,
        description: form.description,
        in_stock: form.inStock,
      };

      const { error: insertError } = await supabase.from("products").insert(payload);

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (refreshProducts) {
        await refreshProducts();
      }

      setStatus({ type: "success", message: "Product added successfully." });
      resetForm();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Failed to add product." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your store products and orders.</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === "add-product" ? "active" : ""}`}
            onClick={() => setActiveTab("add-product")}
          >
            <FiPlusCircle size={18} /> Add Product
          </button>
          <button 
            className={`admin-tab ${activeTab === "edit-products" ? "active" : ""}`}
            onClick={() => setActiveTab("edit-products")}
          >
            <FiEdit2 size={18} /> Edit Products
          </button>
          <button 
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FiPackage size={18} /> Orders
          </button>
        </div>

        {activeTab === "add-product" && (
          <div className="admin-layout">
            <form className="admin-form-card" onSubmit={handleSubmit}>
            <h2><FiPlusCircle size={18} /> Add New Product</h2>

            {status.message && (
              <div className={`admin-alert ${status.type}`}>{status.message}</div>
            )}

            <div className="admin-form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Price (PKR)</label>
                <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {categoryOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fabric</label>
                <input name="fabric" value={form.fabric} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Length</label>
                <input name="length" value={form.length} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Care</label>
                <input name="care" value={form.care} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-image-input form-group">
              <label><FiImage size={16} /> Product Image</label>
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
              />
              In stock
            </label>

            <button className="btn btn-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Adding Product..." : "Add Product"}
            </button>
          </form>

            <aside className="admin-preview-card">
              <h3>Image Preview</h3>
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" />
                  <div className="admin-preview-actions">
                    <button type="button" className="remove-image-btn" onClick={removeNewImage}>
                      <FiX size={14} /> Remove Image
                    </button>
                  </div>
                </>
              ) : (
                <p>Select an image to preview before upload.</p>
              )}
            </aside>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="admin-orders-section">
            <h2><FiPackage size={18} /> All Orders</h2>
            
            {loadingOrders ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="admin-empty">No orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <strong>Order #{order.id}</strong>
                        <span className="order-date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`order-status ${order.status}`}>
                        {order.status === "pending" && "Pending"}
                        {order.status === "delivered" && "Delivered"}
                        {order.status === "not_delivered" && "Not Delivered"}
                      </span>
                    </div>
                    
                    <div className="order-customer">
                      <p><strong>{order.customer_name}</strong></p>
                      <p>{order.customer_email}</p>
                      <p>{order.customer_phone}</p>
                      <p>{order.customer_city}, {order.customer_address}</p>
                    </div>
                    
                    <div className="order-items">
                      <p><strong>Items:</strong></p>
                      {Array.isArray(order.items) && order.items.map((item, idx) => (
                        <p key={idx} className="order-item">
                          {item.name} x {item.quantity} - {item.price}
                        </p>
                      ))}
                    </div>
                    
                    <div className="order-total">
                      <strong>Total: Rs. {Number(order.total).toLocaleString()}</strong>
                    </div>
                    
                    <div className="order-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        disabled={order.status === "delivered"}
                      >
                        <FiCheck size={16} /> Mark Delivered
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => updateOrderStatus(order.id, "not_delivered")}
                        disabled={order.status === "not_delivered"}
                      >
                        <FiX size={16} /> Mark Not Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "edit-products" && (
          <div className="edit-products-section">
            <h2><FiEdit2 size={18} /> Edit Products</h2>
            
            {status.message && (
              <div className={`admin-alert ${status.type}`}>{status.message}</div>
            )}

            {!products || products.length === 0 ? (
              <p className="admin-empty">No products found. Add some products first.</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-edit-card">
                    {editingProduct === product.id ? (
                      <div className="product-edit-form">
                        <div className="edit-form-grid">
                          <div className="form-group">
                            <label>Name</label>
                            <input name="name" value={editForm.name} onChange={handleEditChange} required />
                          </div>
                          <div className="form-group">
                            <label>Price (PKR)</label>
                            <input name="price" type="number" value={editForm.price} onChange={handleEditChange} required />
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={editForm.category} onChange={handleEditChange}>
                              {categoryOptions.map((name) => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Fabric</label>
                            <input name="fabric" value={editForm.fabric} onChange={handleEditChange} />
                          </div>
                          <div className="form-group">
                            <label>Length</label>
                            <input name="length" value={editForm.length} onChange={handleEditChange} />
                          </div>
                          <div className="form-group">
                            <label>Care</label>
                            <input name="care" value={editForm.care} onChange={handleEditChange} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea name="description" rows={2} value={editForm.description} onChange={handleEditChange} />
                        </div>
                        <div className="admin-image-input form-group">
                          <label><FiImage size={16} /> Change Image</label>
                          <div className="admin-image-row">
                            <input type="file" accept="image/*" onChange={handleEditImageChange} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={removeEditImage}
                              disabled={!editPreviewUrl}
                            >
                              <FiX size={14} /> Remove Image
                            </button>
                          </div>
                        </div>
                        {editPreviewUrl ? (
                          <div className="edit-image-preview">
                            <img src={editPreviewUrl} alt="Preview" />
                          </div>
                        ) : (
                          <div className="edit-image-preview empty">
                            <p>No image selected.</p>
                          </div>
                        )}
                        <label className="admin-checkbox">
                          <input
                            type="checkbox"
                            name="inStock"
                            checked={editForm.inStock}
                            onChange={handleEditChange}
                          />
                          In stock
                        </label>
                        <div className="edit-form-actions">
                          <button className="btn btn-primary" onClick={() => saveProduct(product.id)} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="product-edit-image">
                          <img src={product.image || product.image_url} alt={product.name} />
                          {!product.in_stock && <div className="out-of-stock-badge">Out of Stock</div>}
                        </div>
                        <div className="product-edit-details">
                          <h3>{product.name}</h3>
                          <p className="product-price">{product.price}</p>
                          <p className="product-category">{product.category}</p>
                          <div className="product-edit-actions">
                            <button className="btn btn-primary" onClick={() => startEdit(product)}>
                              <FiEdit2 size={14} /> Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>
                              <FiTrash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboardPage;
