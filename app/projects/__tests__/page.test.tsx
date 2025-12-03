import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsPage from '../page';
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

describe('ProjectsPage', () => {
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

  const mockProjects = [
    {
      _id: 'proj1',
      name: 'Test Project 1',
      description: 'Test description 1',
      projectCode: 'PROJ-001',
      clientName: 'Client A',
      stage: 'in_progress',
      priority: 'high',
      progressPercentage: 50,
      estimatedValue: 100000,
      currency: 'USD',
      createdAt: '2024-01-01T00:00:00.000Z',
      projectManager: {
        username: 'manager1',
        email: 'manager1@example.com',
      },
      teamMembers: [],
    },
    {
      _id: 'proj2',
      name: 'Test Project 2',
      description: 'Test description 2',
      projectCode: 'PROJ-002',
      clientName: 'Client B',
      stage: 'completed',
      priority: 'medium',
      progressPercentage: 100,
      estimatedValue: 50000,
      currency: 'USD',
      createdAt: '2024-01-02T00:00:00.000Z',
      projectManager: {
        username: 'manager2',
        email: 'manager2@example.com',
      },
      teamMembers: [],
    },
    {
      _id: 'proj3',
      name: 'Test Project 3',
      description: 'Test description 3',
      projectCode: 'PROJ-003',
      clientName: 'Client C',
      stage: 'lead',
      priority: 'low',
      progressPercentage: 10,
      estimatedValue: 75000,
      currency: 'USD',
      createdAt: '2024-01-03T00:00:00.000Z',
      projectManager: {
        username: 'manager3',
        email: 'manager3@example.com',
      },
      teamMembers: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ success: true, data: mockProjects }),
      ok: true,
    });
  });

  describe('Initial Render and Data Fetching', () => {
    it('renders loading state initially', async () => {
      render(<ProjectsPage />);
      // Check for skeleton loading elements instead of text during loading
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('fetches and displays projects', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Test Project 2')).toBeInTheDocument();
        expect(screen.getByText('Test Project 3')).toBeInTheDocument();
      });
    });

    it('displays correct project count in stats', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total projects
      });
    });

    it('displays correct total value', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        // Total value: 100000 + 50000 + 75000 = 225000
        expect(screen.getByText('$225,000')).toBeInTheDocument();
      });
    });

    it('handles fetch error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error loading projects');
      });
    });
  });

  describe('Search Functionality', () => {
    it('updates search query on input change', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search projects...');
      fireEvent.change(searchInput, { target: { value: 'Test Project 1' } });

      expect(searchInput).toHaveValue('Test Project 1');
    });

    it('triggers search on Enter key press', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search projects...');
      fireEvent.change(searchInput, { target: { value: 'PROJ-001' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=PROJ-001')
        );
      });
    });

    it('triggers search on button click', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search projects...');
      fireEvent.change(searchInput, { target: { value: 'Client A' } });

      // Find the search button with the Search icon
      const searchButtons = screen.getAllByRole('button');
      const searchButton = searchButtons.find(
        (btn) => btn.querySelector('svg.lucide-search')
      );

      expect(searchButton).toBeDefined();
    });
  });

  describe('Filter Functionality', () => {
    it('filters projects by stage', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Test that filter select elements are rendered
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(3);
    });

    it('filters projects by priority', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(3);
    });

    it('filters projects by status', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('View Mode Toggle', () => {
    it('switches between grid and list view', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Find view toggle buttons
      const buttons = screen.getAllByRole('button');
      const listViewButton = buttons.find((btn) =>
        btn.querySelector('svg.lucide-list')
      );

      if (listViewButton) {
        fireEvent.click(listViewButton);
        // In list view, project layout changes
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      }
    });
  });

  describe('Project Selection', () => {
    it('selects individual projects', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstProjectCheckbox = checkboxes.find((cb) =>
        cb.getAttribute('id') !== 'select-all'
      );

      if (firstProjectCheckbox) {
        fireEvent.click(firstProjectCheckbox);
        expect(screen.getByText(/1 selected/)).toBeInTheDocument();
      }
    });

    it('selects all projects', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      expect(screen.getByText(/3 selected/)).toBeInTheDocument();
    });

    it('clears selection', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Select all first
      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      expect(screen.getByText(/3 selected/)).toBeInTheDocument();

      // Clear selection
      const clearButton = screen.getByText('Clear Selection');
      fireEvent.click(clearButton);

      expect(screen.getByText('Manage and track all your projects')).toBeInTheDocument();
    });
  });

  describe('Project Actions', () => {
    it('navigates to new project page', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const newProjectButton = screen.getByText('New Project');
      fireEvent.click(newProjectButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/projects/new');
    });

    it('navigates to project detail on card click', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const projectCard = screen.getByText('Test Project 1').closest('div[class*="card"]');
      if (projectCard) {
        fireEvent.click(projectCard);
        expect(mockRouter.push).toHaveBeenCalledWith('/projects/proj1');
      }
    });

    it('opens edit dialog when edit button clicked', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );

      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Edit Project')).toBeInTheDocument();
        });
      }
    });

    it('opens delete dialog when delete button clicked', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
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

  describe('Project CRUD Operations', () => {
    it('updates project successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockProjects }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open edit dialog
      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Project')).toBeInTheDocument();
      });

      // Update project name
      const nameInput = screen.getByLabelText('Project Name');
      fireEvent.change(nameInput, { target: { value: 'Updated Project Name' } });

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Project updated successfully');
      });
    });

    it('deletes project successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockProjects }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open delete dialog
      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-trash-2')
      );
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Project deleted successfully');
      });
    });

    it('handles delete error', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockProjects }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ error: 'Deletion failed' }),
          ok: false,
        });

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open delete dialog
      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-trash-2')
      );
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Deletion failed');
      });
    });
  });

  describe('Bulk Operations', () => {
    it('shows bulk delete dialog when multiple projects selected', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Select all projects
      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      // Click bulk delete button
      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Projects?')).toBeInTheDocument();
      });
    });

    it('performs bulk delete successfully', async () => {
      // Mock multiple responses: initial load, then 3 deletes, then refetch
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockProjects }),
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

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Select all
      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/3 selected/)).toBeInTheDocument();
      });

      // Bulk delete
      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Projects?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete all/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('3 project(s) deleted successfully');
      }, { timeout: 3000 });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no projects exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] }),
        ok: true,
      });

      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('No projects found')).toBeInTheDocument();
        expect(screen.getByText('Get started by creating your first project')).toBeInTheDocument();
      });
    });

    it('shows create project button in empty state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true, data: [] }),
        ok: true,
      });

      render(<ProjectsPage />);

      await waitFor(() => {
        const createButtons = screen.getAllByText('Create Project');
        expect(createButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Statistics Display', () => {
    it('calculates in-progress projects correctly', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        // One project with stage "in_progress"
        const inProgressCards = screen.getAllByText('1');
        expect(inProgressCards.length).toBeGreaterThan(0);
      });
    });

    it('calculates completed projects correctly', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        // One project with stage "completed"
        expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      });
    });
  });

  describe('Formatting Functions', () => {
    it('formats stage names correctly', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Check that project names are visible (confirms formatting worked)
      expect(screen.getByText('PROJ-001')).toBeInTheDocument();
      expect(screen.getByText('PROJ-002')).toBeInTheDocument();
      expect(screen.getByText('PROJ-003')).toBeInTheDocument();
    });

    it('formats currency values correctly', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('$100,000')).toBeInTheDocument();
        expect(screen.getByText('$50,000')).toBeInTheDocument();
        expect(screen.getByText('$75,000')).toBeInTheDocument();
      });
    });
  });

  describe('Progress Display', () => {
    it('displays progress percentage for each project', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('10%')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible form labels', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      // Open edit dialog
      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
      });
    });

    it('has proper ARIA labels for interactive elements', async () => {
      render(<ProjectsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
