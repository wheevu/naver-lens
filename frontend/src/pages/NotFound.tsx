import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="app-container-clean dark:bg-gray-900 transition-colors duration-300">
      {/* Floating Elements */}
      <div className="floating-elements">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="floating-shape"></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="app-canvas max-w-2xl w-full p-12 bg-white/50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-md transition-colors duration-300">
          <div className="text-center space-y-8">
            {/* 404 Title */}
            <div>
              <h1 
                className="text-9xl mb-4 font-black transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-primary)',
                  background: 'linear-gradient(135deg, #03c75a 0%, #0cf09b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                404
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-naver-green to-transparent rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300" style={{ fontFamily: 'var(--font-secondary)' }}>
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium transition-colors duration-300">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                The link might be broken or the page may have been removed.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={handleGoHome}
                className="btn-primary px-10 py-4 text-lg font-bold tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <p className="text-gray-400 dark:text-gray-500 text-xs transition-colors duration-300">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default NotFound;
