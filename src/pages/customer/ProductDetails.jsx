import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  Check,
  Zap,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useStore() || {};
  const addToCart = store.addToCart || store.cart?.addToCart;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const [selectedEdition, setSelectedEdition] = useState("Pro ANC Edition");
  const [selectedColor, setSelectedColor] = useState("Titanium Gray");
  const [activeTab, setActiveTab] = useState("specs");
  const [bundleAdded, setBundleAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data && data.title) {
            setProduct(data);
            setSelectedImage(
              data.thumbnail || (data.images && data.images[0]) || "",
            );
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
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (addToCart) {
      addToCart({
        ...product,
        quantity,
        edition: selectedEdition,
        color: selectedColor,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleInstantBuy = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleAddBundle = () => {
    if (!product) return;
    if (addToCart) {
      addToCart({ ...product, quantity: 1, isBundle: true });
    }
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
        Loading luxury experience...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        Product not found
      </div>
    );
  }

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];
  const basePrice = Number(product.price);
  const originalPrice = (basePrice * 1.33).toFixed(2);

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
        background: "#f8fafc",
      }}
    >
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <Link to="/" style={{ color: "#64748b", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          style={{ color: "#64748b", textDecoration: "none" }}
        >
          Catalog
        </Link>
        <span>/</span>
        <span style={{ color: "#0f172a", fontWeight: "600" }}>
          {product.title}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "#ffffff",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "380px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "#4f46e5",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "bold",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              ⚡ Super Zoom 360° View
            </span>
            <img
              src={selectedImage}
              alt={product.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "8px",
                  border:
                    selectedImage === img
                      ? "2px solid #4f46e5"
                      : "1px solid #cbd5e1",
                  background: "#f8fafc",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              fontSize: "11px",
              color: "#475569",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Truck size={16} color="#4f46e5" />
              <span>Free Express Shipping</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShieldCheck size={16} color="#4f46e5" />
              <span>2 Year Warranty</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <RotateCcw size={16} color="#4f46e5" />
              <span>14 Day Returns</span>
            </div>
          </div>
        </div>

        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShieldCheck size={14} /> 100% Combat Authentic
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                background: "#dcfce7",
                color: "#166534",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <CheckCircle2 size={14} /> In Stock • Express Delivery
            </span>
          </div>

          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0f172a",
                margin: "4px 0 8px 0",
              }}
            >
              {product.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#eab308",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              <Star size={14} fill="#eab308" />
              {product.rating || 4.8}{" "}
              <span style={{ color: "#64748b", fontWeight: "normal" }}>
                (1,248 verified reviews)
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{ fontSize: "28px", fontWeight: "800", color: "#4f46e5" }}
            >
              ${basePrice.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#94a3b8",
                textDecoration: "line-through",
              }}
            >
              ${originalPrice}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                background: "#dcfce7",
                color: "#166534",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              Save 25%
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                -
              </button>
              <span
                style={{
                  padding: "0 10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "12px",
                background: added ? "#22c55e" : "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          <button
            onClick={handleInstantBuy}
            style={{
              width: "100%",
              padding: "12px",
              background: "#eef2ff",
              color: "#4f46e5",
              border: "1px solid #c7d2fe",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Zap size={16} /> Instant Buy (Apple Pay / Credit Card)
          </button>

          
          <span
            style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}
          >
            📦 Order in next{" "}
            <strong style={{ color: "#ef4444" }}>02:44:00</strong> for same-day
            dispatch.
          </span>
        </div>
      </div>

      
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setActiveTab("specs")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "specs" ? "#4f46e5" : "#64748b",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Ultra Technical Specs
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "reviews" ? "#4f46e5" : "#64748b",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Customer Reviews (1,248)
          </button>
          <button
            onClick={() => setActiveTab("warranty")}
            style={{
              background: "none",
              border: "none",
              color: activeTab === "warranty" ? "#4f46e5" : "#64748b",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Warranty & Return Policy
          </button>
        </div>

        {activeTab === "specs" && (
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
            {product.description}
          </p>
        )}
        {activeTab === "reviews" && (
          <div style={{ color: "#475569", fontSize: "14px" }}>
            ⭐️⭐️⭐️⭐️⭐️ "Outstanding quality and lightning-fast shipping!" —
            Reham A.
          </div>
        )}
        {activeTab === "warranty" && (
          <div
            style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}
          >
            This product includes a 2-year international warranty and 14-day
            hassle-free returns.
          </div>
        )}
      </div>
    </div>
  );
}
