import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { products as fallbackProducts } from "../../data/products";
import { API_URL } from "../../services/api";

const DUMMY_PRODUCTS_URL = "https://dummyjson.com/products?limit=100";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openrouter/free";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const HEADPHONE_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
const IMAGE_FALLBACK =
  "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp";

const imageWords = [
  "image",
  "picture",
  "photo",
  "pic",
  "show me",
  "show",
  "display",
  "صورة",
  "صور",
  "أريني",
  "اعرض",
  "وريني",
  "هات",
  "شوفني",
];

const stopWords = new Set([
  "show",
  "me",
  "the",
  "a",
  "an",
  "image",
  "picture",
  "photo",
  "send",
  "of",
  "please",
  "صورة",
  "صور",
  "من",
  "عن",
  "ال",
  "يا",
  "لو",
  "ممكن",
  "هات",
]);

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const productAliases = {
  headphone: [
    "headphones",
    "earphone",
    "earphones",
    "earbuds",
    "airpods",
    "audio",
  ],
  headphones: [
    "headphone",
    "earphone",
    "earphones",
    "earbuds",
    "airpods",
    "audio",
  ],
  shoe: ["shoes", "sneaker", "sneakers", "footwear"],
  shoes: ["shoe", "sneaker", "sneakers", "footwear"],
  watch: ["watches", "smartwatch", "smartwatches"],
  bag: ["bags", "backpack", "backpacks"],
  phone: ["phones", "smartphone", "smartphones", "mobile"],
  iphone: ["phone", "phones", "smartphone", "smartphones", "mobile"],
  iphones: ["iphone", "phone", "phones", "smartphone", "smartphones", "mobile"],
};

function normalizeProduct(product) {
  const productName = product.title || product.name || "Product";
  const isHeadphone = /headphone|headset/i.test(productName);
  const primaryImage =
    product.thumbnail ||
    (isHeadphone ? HEADPHONE_IMAGE : null) ||
    product.image ||
    product.images?.[0] ||
    IMAGE_FALLBACK;
  return {
    id: product.id,
    name: productName,
    price: Number(product.price || 0),
    image: primaryImage,
    images: product.images?.length ? product.images : [primaryImage],
    category: String(product.category || "General"),
    description: product.description || "",
    rating: product.rating,
    stock: product.stock,
  };
}

function productSearchText(product) {
  return `${product.name} ${product.category} ${product.description}`.toLowerCase();
}

function findProducts(query, catalog) {
  const words = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (!words.length) return [];
  return catalog
    .map((product) => ({
      product,
      score: words.reduce((score, word) => {
        const searchableText = productSearchText(product);
        const aliases = productAliases[word] || [];
        const directMatch = searchableText.includes(word);
        const aliasMatch = aliases.some((alias) =>
          searchableText.includes(alias),
        );
        return score + (directMatch ? 2 : aliasMatch ? 1 : 0);
      }, 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}

function asksForImage(text) {
  const lower = text.toLowerCase();
  return imageWords.some((word) => lower.includes(word));
}

function localReply(text, catalog, matches) {
  const lower = text.toLowerCase();
  if (/\b(js|javascript)\b/.test(lower)) {
    return "JavaScript is a programming language used to make websites interactive. It runs in the browser and can also power servers, mobile apps, and desktop apps. In this project, React and JavaScript are used to build the Spark storefront and AI chat.";
  }
  if (matches.length) {
    const product = matches[0];
    return `${product.name} is available in our store for $${product.price.toFixed(2)}. ${product.description}`;
  }
  if (/price|cost|سعر|بكام|كام/.test(lower)) {
    return "Type a product name or category and I will find its price in our catalog.";
  }
  if (/product|products|منتج|منتجات|available|متاح/.test(lower)) {
    return `We have ${catalog.length} products from DummyJSON. Ask about any product or category, such as electronics or fragrances.`;
  }
  return `I received your message: “${text}”. I can help with Spark products or show an image from the catalog.`;
}

export default function SparkAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storeProducts, setStoreProducts] = useState(() =>
    fallbackProducts.map(normalizeProduct),
  );
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! ✨ I'm Spark AI Concierge. Ask about any product or request an image from the DummyJSON catalog.",
      product: null,
      products: [],
    },
  ]);
  const messagesEndRef = useRef(null);

  const catalogLabel = useMemo(
    () => (storeProducts.length ? "DummyJSON Connected" : "Loading catalog…"),
    [storeProducts.length],
  );

  useEffect(() => {
    let cancelled = false;
    fetch(DUMMY_PRODUCTS_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load product catalog");
        return response.json();
      })
      .then((data) => {
        if (!cancelled && data?.products?.length) {
          const remoteProducts = data.products.map(normalizeProduct);
          const mergedProducts = [
            ...fallbackProducts.map(normalizeProduct),
            ...remoteProducts,
          ];

          const uniqueProducts = mergedProducts.filter(
            (product, index, all) =>
              all.findIndex(
                (item) =>
                  item.name.toLowerCase() === product.name.toLowerCase(),
              ) === index,
          );
          setStoreProducts(uniqueProducts);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const addBotMessage = (message) =>
    setMessages((previous) => [...previous, { sender: "bot", ...message }]);

  const getRemoteTextReply = async (text, history) => {
    const serverResponse = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are Spark's helpful AI assistant. Answer any user text question clearly and directly in English. Use the product catalog only when the question is about Spark products.",
          },
          ...history,
          { role: "user", content: text },
        ],
      }),
    }).catch(() => null);
    if (serverResponse?.ok) {
      const serverData = await serverResponse.json();
      if (serverData?.text) return serverData.text;
    }
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Spark AI Concierge",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are Spark's concise ecommerce assistant. Answer the user's request directly. Do not invent product facts; the catalog is handled by the UI.",
          },
          ...history,
          { role: "user", content: text },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data?.error?.message || "AI request failed");
    return data?.choices?.[0]?.message?.content || null;
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { sender: "user", text, product: null, products: [] };
    const history = messages
      .filter((message) => message.text)
      .map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));
    const matches = findProducts(text, storeProducts);
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (asksForImage(text)) {
        await wait(800);

        const imageWordsInRequest = text
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, " ")
          .split(/\s+/)
          .filter((word) => word.length > 2 && !stopWords.has(word));
        const imageProducts = matches.length
          ? [matches[0]]
          : imageWordsInRequest.length
            ? []
            : storeProducts.slice(0, 4);
        addBotMessage({
          text: matches.length
            ? `Here is the available image for ${matches[0].name} from our store:`
            : imageWordsInRequest.length
              ? `I could not find a product matching "${text}" in the DummyJSON catalog. Try a product name or category.`
              : "Here are product images from our DummyJSON catalog. Type a product name for a specific image:",
          product: null,
          products: imageProducts,
        });
        return;
      }

      const remoteReply = await getRemoteTextReply(text, history).catch(
        () => null,
      );

      if (!remoteReply) await wait(800);
      addBotMessage({
        text: remoteReply || localReply(text, storeProducts, matches),
        product: matches[0] || null,
        products: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProduct = (product) => (
    <div
      key={product.id}
      style={{
        marginTop: "8px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        onError={(event) => {
          const nextImage = product.images.find(
            (image) => image && image !== event.currentTarget.src,
          );
          event.currentTarget.src = nextImage || IMAGE_FALLBACK;
        }}
        style={{
          width: "100%",
          height: "120px",
          objectFit: "contain",
          borderRadius: "6px",
          background: "#fff",
        }}
      />
      <div
        style={{
          marginTop: "6px",
          fontWeight: "bold",
          color: "#1e293b",
          fontSize: "12px",
        }}
      >
        {product.name}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <span
          style={{ color: "#4f46e5", fontWeight: "bold", fontSize: "13px" }}
        >
          ${product.price.toFixed(2)}
        </span>
        <span
          style={{
            fontSize: "10px",
            background: "#e0e7ff",
            color: "#3730a3",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {product.category}
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        fontFamily: "inherit",
      }}
    >
      <style>{`@keyframes bounceDot { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 25px rgba(79,70,229,.4)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <Sparkles size={18} /> Spark AI Concierge
        </button>
      )}
      {isOpen && (
        <div
          style={{
            width: "360px",
            height: "520px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 15px 35px rgba(0,0,0,.15)",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  background: "rgba(255,255,255,.2)",
                  padding: "6px",
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px" }}>
                  Spark AI Concierge
                </h4>
                <span style={{ fontSize: "10px", color: "#c7d2fe" }}>
                  {catalogLabel}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    lineHeight: 1.4,
                    background: message.sender === "user" ? "#4f46e5" : "#fff",
                    color: message.sender === "user" ? "#fff" : "#1e293b",
                    boxShadow:
                      message.sender === "bot"
                        ? "0 2px 5px rgba(0,0,0,.05)"
                        : "none",
                    border:
                      message.sender === "bot" ? "1px solid #e2e8f0" : "none",
                  }}
                >
                  <div>{message.text}</div>
                  {message.product && renderProduct(message.product)}
                  {message.products?.map(renderProduct)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  width: "fit-content",
                  padding: "9px 11px",
                  borderRadius: "12px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: "#4f46e5",
                    borderRadius: "50%",
                    animation: "bounceDot 1.4s infinite",
                  }}
                />
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: "#4f46e5",
                    borderRadius: "50%",
                    animation: "bounceDot 1.4s infinite .16s",
                  }}
                />
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: "#4f46e5",
                    borderRadius: "50%",
                    animation: "bounceDot 1.4s infinite .32s",
                  }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            style={{
              padding: "12px",
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Ask about products or request an image..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "20px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Send message"
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
