import React from 'react';


interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout-container">
            <div className="layout-content">
                {children}
            </div>
            <footer className="layout-footer">
                <p>Powered by BaseScan API</p>
            </footer>
        </div>
    );
};
