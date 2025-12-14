import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-secondary-100">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-display font-bold text-primary-600">
                        PunjabiLearn
                    </Link>
                    <div className="flex-grow"></div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log in</Button>
                        <Button size="sm">Get Started</Button>
                    </div>
                </div>
            </header>
            <main className="flex-grow pt-16">
                {children}
            </main>
            <footer className="bg-white border-t border-secondary-100 py-12">
                <div className="container mx-auto px-4 text-center text-secondary-500">
                    <p>© 2025 PunjabiLearn. Connecting roots to future.</p>
                </div>
            </footer>
        </div>
    );
};
