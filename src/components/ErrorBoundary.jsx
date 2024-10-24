import React from 'react';

// ErrorBoundary component to catch and handle errors in child components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error information
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Display error message when an error occurs
      return (
        <div className="w-full flex justify-center items-center text-white p-4 bg-red-500">
          <h1 className="font-bold text-xl">Something went wrong.</h1>
          {this.state.error && <p className="mt-2">{this.state.error.message}</p>}
        </div>
      );
    }

    // Render children components if no error
    return this.props.children; 
  }
}

export default ErrorBoundary;
