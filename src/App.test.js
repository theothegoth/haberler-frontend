import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the custom hooks and services
jest.mock('./hooks/useVideos', () => ({
  __esModule: true,
  default: () => ({
    videos: [],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

test('renders Haber Videoları heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Haber Videoları/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders layout toggle buttons', () => {
  render(<App />);
  const listViewButton = screen.getByRole('button', { name: /Liste görünüm/i });
  const gridViewButton = screen.getByRole('button', { name: /Gazete görünüm/i });
  expect(listViewButton).toBeInTheDocument();
  expect(gridViewButton).toBeInTheDocument();
});

test('renders category selector', () => {
  render(<App />);
  const categorySelect = screen.getByLabelText(/Kategori/i);
  expect(categorySelect).toBeInTheDocument();
});
