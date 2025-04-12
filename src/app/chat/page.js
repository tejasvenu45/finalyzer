"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      let responseText = data?.data?.response || "🤖 No response received.";
      responseText = responseText
      .replace(/\*\*(.+?)\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")               
      .replace(/_(.+?)_/g, "<em>$1</em>");                         
    

      const botMsg = {
        sender: "bot",
        text: responseText,
        isHtml: true,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const botMsg = {
        sender: "bot",
        text: "⚠️ Error fetching Gemini response.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0f172a, #1e293b)",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "rgba(30, 41, 59, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: 0,
            }}
          >
            <span
              style={{
                background: "linear-gradient(to right, #8B5CF6, #EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              FinAI
            </span>
            <div
              style={{
                background: "linear-gradient(to right, #8B5CF6, #EC4899)",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
              }}
            ></div>
          </h1>
        </header>

        <div
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "1.5rem",
            borderRadius: "12px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            marginBottom: "1.5rem",
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 #1F2937",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                textAlign: "center",
                padding: "0 2rem",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
                }}
              >
                💬
              </div>
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  fontWeight: "500",
                  fontSize: "1.2rem",
                }}
              >
                Welcome to FinAI Chat
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                Ask anything to get started with your AI assistant
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  margin: "1rem 0",
                }}
              >
                {msg.sender === "bot" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                      marginRight: "12px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  style={{
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                        : "rgba(30, 41, 59, 0.8)",
                    padding: "0.9rem 1.2rem",
                    borderRadius:
                      msg.sender === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                    boxShadow:
                      msg.sender === "user"
                        ? "0 4px 15px rgba(139, 92, 246, 0.15)"
                        : "0 4px 15px rgba(0, 0, 0, 0.1)",
                    border:
                      msg.sender === "user"
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                  {...(msg.isHtml
                    ? { dangerouslySetInnerHTML: { __html: msg.text } }
                    : { children: msg.text })}
                />
                {msg.sender === "user" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#3B82F6",
                      marginLeft: "12px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    👤
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "1rem 0",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                  marginRight: "12px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                🤖
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                }}
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#8B5CF6",
                      opacity: 0.7,
                      animation: `pulseDot 1.5s infinite ease-in-out ${
                        n * 0.2
                      }s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            position: "relative",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(15, 23, 42, 0.5)",
              color: "#fff",
              outline: "none",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "0 1.5rem",
              borderRadius: "12px",
              background: loading
                ? "rgba(139, 92, 246, 0.3)"
                : "linear-gradient(135deg, #8B5CF6, #6366F1)",
              color: "#fff",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(139, 92, 246, 0.3)",
              border: "none",
              minWidth: "100px",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <style jsx global>{`
          @keyframes pulseDot {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.5);
              opacity: 1;
            }
          }

          *::-webkit-scrollbar {
            width: 6px;
          }

          *::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.6);
          }

          *::-webkit-scrollbar-thumb {
            background-color: rgba(139, 92, 246, 0.5);
            border-radius: 20px;
          }
        `}</style>
      </div>
    </div>
  );
}