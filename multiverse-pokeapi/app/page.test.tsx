import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to the Multiverse PokeAPI!/i)).toBeInTheDocument();
  });

  it('renders the Pokémon Gallery heading', () => {
    render(<Home />);
    expect(screen.getByText(/Pokémon Gallery/i)).toBeInTheDocument();
  });

  it('renders the Deck section', () => {
    render(<Home />);
    expect(screen.getByText(/Your Deck/i)).toBeInTheDocument();
  });

  // Example interaction test (deck add/remove)
  // This is a placeholder, as actual API mocking is needed for full interaction
  it('shows navigation buttons', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});

