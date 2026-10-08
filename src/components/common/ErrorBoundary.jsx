import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="container py-5 text-center">
          <div
            className="card border-0 shadow-sm p-4 mx-auto"
            style={{ maxWidth: 560 }}
          >
            <h1 className="h3 mb-3">Something went wrong</h1>
            <p className="text-muted mb-4">
              The application could not render this page. Please reload and try
              again.
            </p>
            <button className="btn btn-primary" onClick={this.handleReload}>
              Reload Application
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
