import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit, Package } from "lucide-react";
import {
  getSellerProducts,
  createSellerProduct,
  deleteSellerProduct,
} from "../../services/sellerApi";

const initialDemoProducts = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    category: "Audio",
    price: 129.99,
    stock: 25,
    status: "Active",
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    category: "Wearables",
    price: 89.5,
    stock: 14,
    status: "Active",
  },
  {
    id: "3",
    name: "Ergonomic Gaming Mouse",
    category: "Electronics",
    price: 45.0,
    stock: 8,
    status: "Low Stock",
  },
];

export default function SellerProducts() {
  const [products, setProducts] = useState(initialDemoProducts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Audio",
    price: "",
    stock: "",
  });

  useEffect(() => {
    getSellerProducts()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const added = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock, 10) || 0,
      status: "Active",
    };
    setProducts([added, ...products]);
    setNewProduct({ name: "", category: "Audio", price: "", stock: "" });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    deleteSellerProduct(id).catch(() => {});
    setProducts(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="loading-card">Loading products...</div>;
  }

  return (
    <div className="dashboard-content">
      <div
        className="page-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="eyebrow">INVENTORY</span>
          <h1>My Products</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      <div
        className="form-card"
        style={{ marginBottom: "20px", padding: "16px" }}
      >
        <div className="input-icon" style={{ maxWidth: "300px" }}>
          <Search size={17} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="form-card" style={{ padding: "0", overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>PRODUCT</th>
              <th style={{ padding: "12px 16px" }}>CATEGORY</th>
              <th style={{ padding: "12px 16px" }}>PRICE</th>
              <th style={{ padding: "12px 16px" }}>STOCK</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  {product.name}
                </td>
                <td style={{ padding: "14px 16px", color: "#64748b" }}>
                  {product.category}
                </td>
                <td style={{ padding: "14px 16px", fontWeight: "600" }}>
                  ${Number(product.price).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px" }}>{product.stock} pcs</td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    className={`status-pill ${product.status === "Active" ? "success" : "warning"}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            itemsCenter: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            className="form-card"
            style={{ width: "400px", background: "#fff" }}
          >
            <h3>Add New Product</h3>
            <form
              onSubmit={handleAddProduct}
              className="auth-form"
              style={{ marginTop: "16px" }}
            >
              <label>
                Product Name
                <input
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </label>
              <label>
                Category
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option>Audio</option>
                  <option>Wearables</option>
                  <option>Electronics</option>
                </select>
              </label>
              <label>
                Price ($)
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                />
              </label>
              <div className="inline-actions" style={{ marginTop: "16px" }}>
                <button className="btn btn-primary" type="submit">
                  Save Product
                </button>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
