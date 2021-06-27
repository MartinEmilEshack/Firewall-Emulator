import * as React from 'react';

class ErrorBoundary extends React.Component {
	state = { hasError: false };

	static getDerivedStateFromError(error: any) {
		return { hasError: true };
	} // Update state so the next render will show the fallback UI.    return { hasError: true };  }
	componentDidCatch(error: any, errorInfo: any) {
		console.log(error, errorInfo);
	} // You can also log the error to an error reporting service    logErrorToMyService(error, errorInfo);  }
	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		} // You can render any custom fallback UI      return <h1>Something went wrong.</h1>;    }
		return this.props.children;
	}
}
