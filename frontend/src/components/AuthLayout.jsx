import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        title1: "Collaborate.",
        title2: "Code Together.",
        title3: "Innovate.",
        description: "Build amazing projects with real-time collaboration, AI-powered assistance, and seamless team workflows.",
        image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=2670&auto=format&fit=crop",
        accent: "from-[#FC9986] to-[#FFB4A2]"
    },
    {
        title1: "Create.",
        title2: "Share Ideas.",
        title3: "Build Fast.",
        description: "Instant code sharing, live editing, and AI suggestions to accelerate your development workflow.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
        accent: "from-[#FC9986] to-[#FFCAB8]"
    },
    {
        title1: "Learn.",
        title2: "Grow Together.",
        title3: "Succeed.",
        description: "Connect with fellow students, get AI-powered help, and turn your ideas into working projects.",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
        accent: "from-[#FFB4A2] to-[#FC9986]"
    }
];

const AuthLayout = ({ title, subtitle, linkText, linkTo, children, onSubmit, type }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-change slides every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const slide = slides[currentSlide];

    return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2228] via-[#1e1a1d] to-[#1a1618] flex items-center justify-center p-6 md:p-8">
            <div className="bg-[#13131a] rounded-[2rem] shadow-2xl shadow-[#FC9986]/10 w-full max-w-[1100px] flex overflow-hidden min-h-[680px] border border-gray-800/50">
                {/* Left Side - Image Carousel */}
                <div className="hidden lg:flex w-[55%] relative bg-gradient-to-br from-gray-900 to-[#13131a] flex-col justify-end p-10 xl:p-14 text-white overflow-hidden">
                    {/* Background Image with transition */}
                    <img 
                        key={currentSlide}
                        src={slide.image}
                        alt="Collaborative coding workspace" 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-[#13131a]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#13131a]/70 to-transparent"></div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-1/4 right-10 w-32 h-32 bg-[#FC9986]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/3 left-10 w-24 h-24 bg-[#FC9986]/10 rounded-full blur-2xl"></div>

                    {/* Slide Content with animation */}
                    <div className="relative z-10 mb-6">
                        <h2 
                            key={`t1-${currentSlide}`}
                            className="text-4xl xl:text-5xl font-bold mb-2 leading-[1.1] tracking-tight text-white animate-fade-in"
                        >
                            {slide.title1}
                        </h2>
                        <h2 
                            key={`t2-${currentSlide}`}
                            className={`text-4xl xl:text-5xl font-bold mb-2 leading-[1.1] tracking-tight bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent animate-fade-in`}
                            style={{ animationDelay: '0.1s' }}
                        >
                            {slide.title2}
                        </h2>
                        <h2 
                            key={`t3-${currentSlide}`}
                            className="text-4xl xl:text-5xl font-bold mb-8 leading-[1.1] tracking-tight text-white/90 animate-fade-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {slide.title3}
                        </h2>
                        <p 
                            key={`desc-${currentSlide}`}
                            className="text-gray-400 text-base xl:text-lg max-w-[320px] leading-relaxed font-light animate-fade-in"
                            style={{ animationDelay: '0.3s' }}
                        >
                            {slide.description}
                        </p>
                        
                        {/* Slide indicators */}
                        <div className="flex items-center gap-3 mt-10">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentSlide 
                                            ? 'w-12 bg-[#FC9986]' 
                                            : 'w-3 bg-gray-700 hover:bg-[#FC9986]/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Logo */}
                    <div className="absolute top-8 left-8 xl:left-10 z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FC9986] rounded-xl flex items-center justify-center shadow-lg shadow-[#FC9986]/25">
                            <i className="ri-shining-fill text-[#1a1a24] text-lg"></i>
                        </div>
                        <span className="text-xl xl:text-2xl font-semibold tracking-wide text-white">Collabify</span>
                    </div>
                    
                    <Link to="/" className="absolute top-8 right-8 xl:right-10 z-10 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 flex items-center gap-2 group">
                        Back to website 
                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
                    </Link>
                </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[45%] p-8 md:p-10 xl:p-14 flex flex-col justify-center bg-[#13131a]">
            <div className="max-w-[380px] mx-auto w-full">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#FC9986] rounded-xl flex items-center justify-center shadow-lg shadow-[#FC9986]/25">
                        <i className="ri-shining-fill text-[#1a1a24] text-lg"></i>
                    </div>
                    <span className="text-xl font-semibold tracking-wide text-white">Collabify</span>
                </div>

                <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3 tracking-tight">{title}</h2>
                <p className="text-gray-500 mb-8 text-base">
                    {subtitle}{' '}
                    <Link to={linkTo} className="text-[#FC9986] hover:text-[#FFB4A2] font-medium transition-colors duration-200">{linkText}</Link>
                </p>

                <form onSubmit={onSubmit} className="space-y-5">
                    {children}
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800/80"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#13131a] text-gray-600 font-medium">Or {type === 'login' ? 'login' : 'register'} with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 hover:border-gray-700 transition-all duration-200 bg-transparent font-medium group">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-800 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 hover:border-gray-700 transition-all duration-200 bg-transparent font-medium group">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;