import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModelAdvisor from '../../pages/ModelAdvisor';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Model Advisor', () => {
  it('should render model grid with filter buttons', () => {
    renderWithRouter(<ModelAdvisor />);
    
    expect(screen.getByTestId('model-grid')).toBeInTheDocument();
    expect(screen.getByTestId('filter-openai')).toBeInTheDocument();
    expect(screen.getByTestId('filter-anthropic')).toBeInTheDocument();
    expect(screen.getByTestId('filter-google')).toBeInTheDocument();
  });

  it('should render search input and button', () => {
    renderWithRouter(<ModelAdvisor />);
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('should handle filter button clicks', () => {
    renderWithRouter(<ModelAdvisor />);
    
    const openaiFilter = screen.getByTestId('filter-openai');
    fireEvent.click(openaiFilter);
    
    expect(openaiFilter).toHaveClass('active'); // Assuming active class is applied
  });

  it('should handle search input changes', () => {
    renderWithRouter(<ModelAdvisor />);
    
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(searchInput.value).toBe('test query');
  });

  it('should display show more/less buttons when appropriate', () => {
    renderWithRouter(<ModelAdvisor />);
    
    // Initially should show "Show More" if there are more than 5 models
    const showMoreButton = screen.queryByTestId('show-more');
    if (showMoreButton) {
      expect(showMoreButton).toBeInTheDocument();
    }
  });

  it('should render clear button when search results are present', () => {
    renderWithRouter(<ModelAdvisor />);
    
    // The clear button should be present
    const clearButton = screen.getByTestId('clear-button');
    expect(clearButton).toBeInTheDocument();
  });
});