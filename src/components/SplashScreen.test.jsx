/**
 * SplashScreen.test.jsx
 * 
 * Unit tests for the SplashScreen component.
 * Tests rendering, logo display, title text, and visibility integration.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SplashScreen from './SplashScreen';

// Mock NavigationContext to control visibility state
const mockNavigationContext = {
  isVisible: false,
  showSplash: jest.fn(),
  hideSplash: jest.fn(),
  SPLASH_DURATION: 800
};

// Create a mock provider for testing
jest.mock('../context/NavigationContext', () => ({
  ...jest.requireActual('../context/NavigationContext'),
  useNavigation: () => mockNavigationContext
}));

/**
 * Helper function to render SplashScreen with necessary providers
 */
const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <SplashScreen />
    </BrowserRouter>
  );
};

describe('SplashScreen Component', () => {
  beforeEach(() => {
    // Reset mock values before each test
    mockNavigationContext.isVisible = false;
  });

  describe('Visibility States', () => {
    test('renders nothing when isVisible is false', () => {
      mockNavigationContext.isVisible = false;
      renderWithProviders();
      
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument();
    });

    test('renders splash screen when isVisible is true', () => {
      mockNavigationContext.isVisible = true;
      renderWithProviders();
      
      expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    });
  });

  describe('Component Content', () => {
    beforeEach(() => {
      mockNavigationContext.isVisible = true;
    });

    test('displays the logo image', () => {
      renderWithProviders();
      
      const logo = screen.getByTestId('splash-logo');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName.toLowerCase()).toBe('img');
      expect(logo).toHaveAttribute('alt', 'Weather App Logo');
    });

    test('displays "Weather App" title', () => {
      renderWithProviders();
      
      const title = screen.getByTestId('splash-title');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBe('Weather App');
    });

    test('displays subtitle text', () => {
      renderWithProviders();
      
      const subtitle = screen.getByTestId('splash-subtitle');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.textContent).toBe('Your daily forecast');
    });

    test('splash screen has correct CSS class', () => {
      renderWithProviders();
      
      const splashScreen = screen.getByTestId('splash-screen');
      expect(splashScreen).toHaveClass('splash-screen');
    });

    test('logo has correct CSS class', () => {
      renderWithProviders();
      
      const logo = screen.getByTestId('splash-logo');
      expect(logo).toHaveClass('splash-logo');
    });

    test('title has correct CSS class', () => {
      renderWithProviders();
      
      const title = screen.getByTestId('splash-title');
      expect(title).toHaveClass('splash-title');
    });

    test('subtitle has correct CSS class', () => {
      renderWithProviders();
      
      const subtitle = screen.getByTestId('splash-subtitle');
      expect(subtitle).toHaveClass('splash-subtitle');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockNavigationContext.isVisible = true;
    });

    test('logo has alt text for screen readers', () => {
      renderWithProviders();
      
      const logo = screen.getByAltText('Weather App Logo');
      expect(logo).toBeInTheDocument();
    });

    test('title uses h1 element for proper document structure', () => {
      renderWithProviders();
      
      const title = screen.getByTestId('splash-title');
      expect(title.tagName.toLowerCase()).toBe('h1');
    });
  });
});
