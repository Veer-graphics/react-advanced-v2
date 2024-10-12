import React from 'react';
import { useToast, Heading } from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
        this.toast = null; // Initialize toast variable
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        const { hasError, errorMessage } = this.state;

        if (hasError) {
            if (!this.toast) {
                this.toast = useToast()({
                    title: "An error occurred.",
                    description: errorMessage || "Something went wrong.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            return <Heading>Something went wrong</Heading>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
