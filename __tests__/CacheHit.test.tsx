import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SummarizerPage from '@/app/summarizer/page'; // Adjust path
import * as api from '@/lib/api';

// Mock the API call
jest.mock('@/lib/api', () => ({
  summarizeDocument: jest.fn(),
}));

describe('Summarizer Cache Logic', () => {
  it('displays the 85% similarity message on a cache hit', async () => {
    // 1. Mock the backend response for a fuzzy cache hit
    (api.summarizeDocument as jest.Mock).mockResolvedValue({
      status: 'sqlite_fuzzy_cache',
      final_summary: 'This is a cached summary.',
      final_judge_result: { critique: 'Fuzzy match' }
    });

    render(<SummarizerPage />);

    // 2. Simulate user input
    const textarea = screen.getByPlaceholderText(/Paste your document/i);
    fireEvent.change(textarea, { target: { value: 'This is a long document to summarize...' } });

    // 3. Click the button
    const button = screen.getByText(/Start RefineBot/i);
    fireEvent.click(button);

    // 4. Assert the 85% message appears
    await waitFor(() => {
      expect(screen.getByText(/Success: 85%\+ Similarity Match/i)).toBeInTheDocument();
    });

    // 5. Assert the summary is displayed
    expect(screen.getByText('This is a cached summary.')).toBeInTheDocument();
  });
});