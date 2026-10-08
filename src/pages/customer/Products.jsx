import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Heart,
  Check,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

const categoriesList = [
  { slug: "all", name: "All Categories" },
  { slug: "electronics", name: "Electronics" },
  { slug: "laptops", name: "Laptops" },
  { slug: "smartphones", name: "Smartphones" },
  { slug: "mobile-accessories", name: "Accessories" },
  { slug: "beauty", name: "Beauty" },
  { slug: "fragrances", name: "Fragrances" },
  { slug: "groceries", name: "Groceries" },
];

export default function Products() {
  const { category } = useParams();
  const navigate = useNavigate();

  const store = useStore() || {};
  const addToCart = store.addToCart || store.cart?.addToCart;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState({});
  const [addedMap, setAddedMap] = useState({});

  const currentCategory = category ? category.toLowerCase() : "all";

  useEffect(() => {
    const checkHeaderSearch = () => {
      const savedSearch = localStorage.getItem("spark_search");
      if (savedSearch) {
        setSearch(savedSearch);
        localStorage.removeItem("spark_search");
      }
    };
    checkHeaderSearch();
    window.addEventListener("storage", checkHeaderSearch);
    return () => window.removeEventListener("storage", checkHeaderSearch);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const savedWishlist = JSON.parse(
      localStorage.getItem("spark_wishlist") || "[]",
    );
    const wishMap = {};
    savedWishlist.forEach((item) => {
      wishMap[item.id] = true;
    });
    setWishlist(wishMap);

    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data && data.products) {
            setProducts(data.products);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (slug) => {
    if (slug === "all") {
      navigate("/products");
    } else {
      navigate(`/category/${slug}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart({ ...product, quantity: 1 });
    }
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    let currentWishlist = JSON.parse(
      localStorage.getItem("spark_wishlist") || "[]",
    );
    const exists = currentWishlist.some((item) => item.id === product.id);

    if (exists) {
      currentWishlist = currentWishlist.filter(
        (item) => item.id !== product.id,
      );
      setWishlist((prev) => ({ ...prev, [product.id]: false }));
    } else {
      currentWishlist.push(product);
      setWishlist((prev) => ({ ...prev, [product.id]: true }));
    }

    localStorage.setItem("spark_wishlist", JSON.stringify(currentWishlist));
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      currentCategory === "all" ||
      (currentCategory === "electronics"
        ? [
            "laptops",
            "smartphones",
            "mobile-accessories",
            "electronics",
          ].includes(p.category?.toLowerCase())
        : p.category?.toLowerCase() === currentCategory);

    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const activeCategoryName =
    categoriesList.find((c) => c.slug === currentCategory)?.name || "Products";

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
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
            CATALOG
          </span>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#0f172a",
              margin: "2px 0 0 0",
            }}
          >
            {search ? `Search results for "${search}"` : activeCategoryName}
          </h1>
          <p
            style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}
          >
            Explore items from our catalog.
          </p>
        </div>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#334155",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "8px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {categoriesList.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: isActive ? "1px solid #6366f1" : "1px solid #cbd5e1",
                background: isActive ? "#6366f1" : "#ffffff",
                color: isActive ? "#ffffff" : "#475569",
                fontWeight: isActive ? "600" : "500",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
            }}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: "13px", color: "#64748b" }}>
        {loading
          ? "Updating catalog..."
          : `${filteredProducts.length} products found`}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px",
          minHeight: "500px",
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  background: "#f1f5f9",
                  borderRadius: "12px",
                  height: "320px",
                  border: "1px solid #e2e8f0",
                }}
              ></div>
            ))
          : filteredProducts.map((product) => {
              const isAdded = addedMap[product.id];
              const isFav = wishlist[product.id];

              return (
                <div
                  key={product.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={(e) => handleToggleWishlist(e, product)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#ffffff",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  >
                    <Heart
                      size={16}
                      color={isFav ? "#ef4444" : "#64748b"}
                      fill={isFav ? "#ef4444" : "none"}
                    />
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      style={{
                        height: "200px",
                        background: "#f8fafc",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={
                          product.thumbnail ||
                          (product.images && product.images[0]) ||
                          ""
                        }
                        alt={product.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          color: "#eab308",
                        }}
                      >
                        <Star size={14} fill="#eab308" />
                        <strong>{product.rating || 4.5}</strong>
                      </div>

                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#0f172a",
                          margin: 0,
                          height: "40px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {product.title}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <strong style={{ fontSize: "18px", color: "#4f46e5" }}>
                          ${Number(product.price).toFixed(2)}
                        </strong>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            padding: "8px 12px",
                            background: isAdded ? "#22c55e" : "#6366f1",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "background 0.2s",
                          }}
                        >
                          {isAdded ? (
                            <Check size={14} />
                          ) : (
                            <ShoppingBag size={14} />
                          )}
                          {isAdded ? "Added" : "Add"}
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
      </div>
    </div>
  );
}
