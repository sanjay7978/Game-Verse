import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Unexpected runtime error.",
    };
  }

  componentDidCatch(error) {
    console.error("GameVerse runtime error:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      window.localStorage.clear();
    } catch {
      // Ignore storage clear failures.
    }
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background:
            "radial-gradient(circle at top, rgba(82, 51, 173, 0.34), transparent 30%), linear-gradient(135deg, #040612 0%, #070c1f 52%, #03040b 100%)",
          color: "#f3f7ff",
          fontFamily: '"Rajdhani", sans-serif',
        }}
      >
        <div
          style={{
            width: "min(100%, 560px)",
            borderRadius: 28,
            padding: "30px 28px",
            background: "rgba(18, 26, 54, 0.72)",
            border: "1px solid rgba(255, 77, 141, 0.32)",
            boxShadow: "0 0 36px rgba(255, 77, 141, 0.16)",
          }}
        >
          <div style={{ color: "#a8b1d1", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            System Alert
          </div>
          <h1
            style={{
              margin: "10px 0 12px",
              fontFamily: '"Orbitron", sans-serif',
              color: "#45d6ff",
            }}
          >
            GameVerse hit a runtime error
          </h1>
          <p style={{ margin: 0, color: "#a8b1d1", lineHeight: 1.6 }}>
            The app failed while rendering. You can reload, or clear saved local data if an old broken value is causing the crash.
          </p>
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffc857",
            }}
          >
            {this.state.errorMessage}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <button
              onClick={this.handleReload}
              style={{
                border: "none",
                borderRadius: 14,
                padding: "0.9rem 1.3rem",
                background: "linear-gradient(135deg, #45d6ff, #d6f8ff)",
                color: "#07111e",
                cursor: "pointer",
              }}
            >
              Reload App
            </button>
            <button
              onClick={this.handleResetStorage}
              style={{
                borderRadius: 14,
                padding: "0.9rem 1.3rem",
                background: "rgba(255,255,255,0.05)",
                color: "#f3f7ff",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
              }}
            >
              Clear Saved Data
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
