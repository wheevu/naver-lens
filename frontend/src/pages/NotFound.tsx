import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-secondary)",
      }}
    >
      {/* Background Effects */}
      <div className="floating-elements opacity-20">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="floating-shape"></div>
        ))}
      </div>

      {/* Main Card */}
      <div
        className="max-w-2xl w-full p-12 rounded-3xl shadow-2xl backdrop-blur-md border relative z-10 text-center space-y-8"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
        }}
      >
        {/* 404 Title */}
        <div>
          <h1
            className="text-9xl mb-4 font-black"
            style={{
              fontFamily: "var(--font-primary)",
              backgroundImage: "var(--gradient-button)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.2))",
            }}
          >
            404
          </h1>

          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-lg opacity-80">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm opacity-60 mt-2">
            The link might be broken or the page may have been removed.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            onClick={handleGoHome}
            className="px-10 py-4 text-lg font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-white hover:cursor-pointer"
            style={{
              background: "var(--gradient-button)",
              boxShadow: "var(--button-shadow)",
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Footer info */}
        <div
          className="pt-8 border-t"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <p className="text-xs opacity-50">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
