import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LocationModal } from './components/common/LocationModal';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';
import { MyBookingsModal } from './components/common/MyBookingsModal';
import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { CinemaHallPage } from './pages/CinemaHallPage';
import { SnacksPage } from './pages/SnacksPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { DigitalTicketPage } from './pages/DigitalTicketPage';
import { TicketVerificationPage } from './pages/TicketVerificationPage';
import { CITIES } from './data/citiesData';

function App() {
  // Global selected city with persistence
  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_city');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CITIES[0]; // Default: Mumbai
  });

  // Global selected language filter
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Modals state
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('cineverse_city', JSON.stringify(city));
    } catch {}
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#08090d] text-white flex flex-col selection:bg-red-600 selection:text-white">
          {/* Navigation Bar */}
          <Navbar
            selectedCity={selectedCity}
            onOpenLocationModal={() => setLocationModalOpen(true)}
            onOpenSearchModal={() => setSearchModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />

          {/* Dynamic Route Pages */}
          <div className="flex-1">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage
                    selectedCity={selectedCity}
                    onOpenLocationModal={() => setLocationModalOpen(true)}
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={setSelectedLanguage}
                  />
                } 
              />
              <Route 
                path="/movie/:id" 
                element={
                  <MovieDetailsPage 
                    selectedCity={selectedCity} 
                  />
                } 
              />
              <Route 
                path="/cinema-hall" 
                element={
                  <CinemaHallPage />
                } 
              />
              <Route 
                path="/snacks" 
                element={
                  <SnacksPage />
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <CheckoutPage />
                } 
              />
              <Route 
                path="/payment" 
                element={
                  <PaymentPage />
                } 
              />
              <Route 
                path="/ticket/:ticketCode" 
                element={
                  <DigitalTicketPage />
                } 
              />
              <Route 
                path="/verify-ticket/:ticketCode" 
                element={
                  <TicketVerificationPage />
                } 
              />
              <Route 
                path="/verify-ticket" 
                element={
                  <TicketVerificationPage />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global Footer */}
          <Footer />

          {/* Global Modals */}
          <LocationModal
            isOpen={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
          />

          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
          />

          <AuthModal />
          <MyBookingsModal />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
