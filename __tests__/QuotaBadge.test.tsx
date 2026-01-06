import { render, screen } from '@testing-library/react'
import QuotaBadge from '@/app/summarizer/QuotaBadge' // Check your actual path!

describe('QuotaBadge', () => {
  it('renders the quota numbers correctly', () => {
    render(<QuotaBadge stepsTaken={2} maxSteps={3} />)
    
    const badgeElement = screen.getByText(/2 \/ 3/i)
    expect(badgeElement).toBeInTheDocument()
  })

  it('applies red styling when quota is full', () => {
    render(<QuotaBadge stepsTaken={3} maxSteps={3} />)
    
    const badgeElement = screen.getByText(/3 \/ 3/i)
    // Adjust this to match whatever CSS class you use for "Full" state
    expect(badgeElement.parentElement).toHaveClass('text-red-500') 
  })
})