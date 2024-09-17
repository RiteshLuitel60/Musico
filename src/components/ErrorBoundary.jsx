import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex justify-center items-center text-white p-4 bg-red-500">
          <h1 className="font-bold text-xl">Something went wrong.</h1>
          {this.state.error && <p className="mt-2">{this.state.error.message}</p>}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
