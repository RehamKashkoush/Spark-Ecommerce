import React, { useEffect, useState } from "react";
import { Search, Package, Trash2, Tag, ExternalLink } from "lucide-react";
import * as adminApi from "../../services/adminApi";

const initialDemoProducts = [
  {
    id: "PROD-301",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    seller: "TechZone Store",
    stock: 45,
    status: "Active",
  },
  {
    id: "PROD-302",
    name: "Ergonomic Leather Gaming Chair",
    category: "Furniture",
    price: 249.5,
    seller: "Home Essentials",
    stock: 12,
    status: "Active",
  },
  {
    id: "PROD-303",
    name: "Smart Fitness Watch Series 5",
    category: "Electronics",
    price: 129.0,
    seller: "TechZone Store",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PROD-304",
    name: "Cotton Minimalist Hoodie",
    category: "Fashion",
    price: 49.99,
    seller: "Fashion Hub",
    stock: 85,
    status: "Active",
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(initialDemoProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminApi && adminApi.getAdminProducts) {
      adminApi
        .getAdminProducts()
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = (id) => {
    if (adminApi && adminApi.deleteProduct) {
      adminApi.deleteProduct(id).catch(() => {});
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ padding: "24px", color: "#64748b" }}>
        Loading products catalog...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#6366f1",
              letterSpacing: "0.05em",
            }}
          >
            CATALOG MANAGEMENT
          </span>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "4px 0 0 0",
            }}
          >
            Platform Products
          </h1>
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search products or sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px 8px 34px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              width: "100%",
              outline: "none",
            }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {["All", "Electronics", "Fashion", "Furniture"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                border: "1px solid #e2e8f0",
                background: categoryFilter === cat ? "#6366f1" : "#ffffff",
                color: categoryFilter === cat ? "#ffffff" : "#475569",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
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
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <th style={{ padding: "12px 16px" }}>PRODUCT</th>
              <th style={{ padding: "12px 16px" }}>CATEGORY</th>
              <th style={{ padding: "12px 16px" }}>PRICE</th>
              <th style={{ padding: "12px 16px" }}>SELLER</th>
              <th style={{ padding: "12px 16px" }}>STOCK</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Package size={16} color="#6366f1" />
                    {p.name}
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    <Tag size={12} /> {p.category}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  ${Number(p.price).toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontSize: "13px",
                  }}
                >
                  {p.seller}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    color: p.stock > 0 ? "#334155" : "#ef4444",
                    fontWeight: "500",
                  }}
                >
                  {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background: p.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: p.status === "Active" ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      padding: "4px",
                    }}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td
                  colSpan="7"
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
    </div>
  );
}
