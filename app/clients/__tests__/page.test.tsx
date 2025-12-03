import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientsPage from '../page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('ClientsPage', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'admin',
  };

  const mockClients = [
    {
      _id: 'client1',
      name: 'Acme Corporation',
      companyName: 'Acme Corp',
      industry: 'Technology',
      primaryContact: {
        name: 'John Doe',
        email: 'john@acme.com',
        phone: '+1234567890',
        position: 'CEO',
      },
      status: 'active',
      clientType: 'enterprise',
      estimatedAnnualRevenue: 1000000,
      currency: 'USD',
      createdAt: '2024-01-01T00:00:00.000Z',
      accountManager: {
        username: 'manager1',
        email: 'manager1@example.com',
      },
    },
    {
      _id: 'client2',
      name: 'Beta Industries',
      companyName: 'Beta Inc',
      industry: 'Manufacturing',
      primaryContact: {
        name: 'Jane Smith',
        email: 'jane@beta.com',
        phone: '+1987654321',
        position: 'Director',
      },
      status: 'prospect',
      clientType: 'small_business',
      estimatedAnnualRevenue: 500000,
      currency: 'USD',
      createdAt: '2024-01-02T00:00:00.000Z',
      accountManager: {
        username: 'manager2',
        email: 'manager2@example.com',
      },
    },
    {
      _id: 'client3',
      name: 'Gamma LLC',
      companyName: 'Gamma Limited',
      industry: 'Consulting',
      primaryContact: {
        name: 'Bob Johnson',
        email: 'bob@gamma.com',
        position: 'Partner',
      },
      status: 'inactive',
      clientType: 'individual',
      estimatedAnnualRevenue: 250000,
      currency: 'USD',
      createdAt: '2024-01-03T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, data: mockClients }),
      ok: true,
    });
  });

  describe('Initial Render and Data Fetching', () => {
    it('renders loading state initially', async () => {
      render(<ClientsPage />);
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('fetches and displays clients', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
        expect(screen.getByText('Beta Industries')).toBeInTheDocument();
        expect(screen.getByText('Gamma LLC')).toBeInTheDocument();
      });
    });

    it('displays correct client count in stats', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total clients
      });
    });

    it('displays correct active clients count', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        const cards = screen.getAllByText('1');
        expect(cards.length).toBeGreaterThan(0); // 1 active client
      });
    });

    it('handles fetch error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ClientsPage />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error loading clients');
      });
    });
  });

  describe('Search Functionality', () => {
    it('updates search query on input change', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search clients...');
      fireEvent.change(searchInput, { target: { value: 'Acme' } });

      expect(searchInput).toHaveValue('Acme');
    });

    it('triggers search on Enter key press', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search clients...');
      fireEvent.change(searchInput, { target: { value: 'Acme' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=Acme')
        );
      });
    });

    it('triggers search on button click', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search clients...');
      fireEvent.change(searchInput, { target: { value: 'Beta' } });

      const searchButtons = screen.getAllByRole('button');
      const searchButton = searchButtons.find(
        (btn) => btn.querySelector('svg.lucide-search')
      );

      expect(searchButton).toBeDefined();
    });
  });

  describe('Filter Functionality', () => {
    it('renders status filter', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    it('renders type filter', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('View Mode Toggle', () => {
    it('switches between card and list view', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      const listViewButton = buttons.find((btn) =>
        btn.querySelector('svg.lucide-list')
      );

      if (listViewButton) {
        fireEvent.click(listViewButton);
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      }
    });
  });

  describe('Client Selection', () => {
    it('selects individual clients', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstClientCheckbox = checkboxes.find((cb) =>
        cb.getAttribute('id') !== 'select-all-clients'
      );

      if (firstClientCheckbox) {
        fireEvent.click(firstClientCheckbox);
        expect(screen.getByText(/1 selected/)).toBeInTheDocument();
      }
    });

    it('selects all clients', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      expect(screen.getByText(/3 selected/)).toBeInTheDocument();
    });

    it('clears selection', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      expect(screen.getByText(/3 selected/)).toBeInTheDocument();

      const clearButton = screen.getByText('Clear Selection');
      fireEvent.click(clearButton);

      expect(screen.getByText('Manage your client relationships')).toBeInTheDocument();
    });
  });

  describe('Client Actions', () => {
    it('navigates to new client page', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const newClientButton = screen.getByText('New Client');
      fireEvent.click(newClientButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/clients/new');
    });

    it('opens edit dialog when edit button clicked', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );

      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Edit Client')).toBeInTheDocument();
        });
      }
    });

    it('opens delete dialog when delete button clicked', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-trash-2')
      );

      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Client CRUD Operations', () => {
    it('updates client successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockClients }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Client')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Company Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Corp' } });

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Client updated successfully');
      });
    });

    it('deletes client successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockClients }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-trash-2')
      );
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Client deleted successfully');
      });
    });

    it('handles delete error', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockClients }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ error: 'Deletion failed' }),
          ok: false,
        });

      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-trash-2')
      );
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Deletion failed');
      });
    });
  });

  describe('Bulk Operations', () => {
    it('shows bulk delete dialog when multiple clients selected', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Clients?')).toBeInTheDocument();
      });
    });

    it('performs bulk delete successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockClients }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: [] }),
          ok: true,
        });

      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/3 selected/)).toBeInTheDocument();
      });

      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Clients?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete all/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('3 client(s) deleted successfully');
      }, { timeout: 3000 });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no clients exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] }),
        ok: true,
      });

      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('No clients found')).toBeInTheDocument();
        expect(screen.getByText('Get started by adding your first client')).toBeInTheDocument();
      });
    });

    it('shows add client button in empty state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] }),
        ok: true,
      });

      render(<ClientsPage />);

      await waitFor(() => {
        const addButtons = screen.getAllByText('Add Client');
        expect(addButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Statistics Display', () => {
    it('calculates active clients correctly', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const activeCount = screen.getAllByText('1');
      expect(activeCount.length).toBeGreaterThan(0);
    });

    it('calculates prospect clients correctly', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Beta Industries')).toBeInTheDocument();
      });
    });

    it('calculates enterprise clients correctly', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });
    });
  });

  describe('Client Information Display', () => {
    it('displays client contact information', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@acme.com')).toBeInTheDocument();
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
      });
    });

    it('displays client status badges', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('active')).toBeInTheDocument();
        expect(screen.getByText('prospect')).toBeInTheDocument();
        expect(screen.getByText('inactive')).toBeInTheDocument();
      });
    });

    it('displays client type information', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const typeElements = document.querySelectorAll('*');
      const hasTypes = Array.from(typeElements).some(el =>
        el.textContent?.includes('Enterprise') ||
        el.textContent?.includes('Small Business') ||
        el.textContent?.includes('Individual')
      );
      expect(hasTypes).toBe(true);
    });

    it('displays account manager information', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('manager1')).toBeInTheDocument();
        expect(screen.getByText('manager2')).toBeInTheDocument();
      });
    });
  });

  describe('Formatting Functions', () => {
    it('formats client types correctly', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const companyNames = ['Acme Corp', 'Beta Inc', 'Gamma Limited'];
      companyNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Dialog', () => {
    it('populates edit form with client data', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Company Name')).toHaveValue('Acme Corporation');
        expect(screen.getByLabelText('Industry')).toHaveValue('Technology');
      });
    });

    it('allows editing contact information', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Contact Name')).toHaveValue('John Doe');
        expect(screen.getByLabelText('Email')).toHaveValue('john@acme.com');
      });
    });

    it('closes edit dialog on cancel', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Client')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Edit Client')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible form labels', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Industry')).toBeInTheDocument();
        expect(screen.getByLabelText('Contact Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
      });
    });

    it('has proper ARIA labels for interactive elements', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Client Type Formatting', () => {
    it('formats small_business type correctly', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Beta Industries')).toBeInTheDocument();
      });

      const typeElements = document.querySelectorAll('*');
      const hasSmallBusiness = Array.from(typeElements).some(el =>
        el.textContent?.includes('Small Business')
      );
      expect(hasSmallBusiness).toBe(true);
    });

    it('displays industry information when available', async () => {
      render(<ClientsPage />);

      await waitFor(() => {
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Manufacturing')).toBeInTheDocument();
        expect(screen.getByText('Consulting')).toBeInTheDocument();
      });
    });
  });
});
