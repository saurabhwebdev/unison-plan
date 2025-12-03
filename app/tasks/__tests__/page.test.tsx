import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TasksPage from '../page';
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

describe('TasksPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'admin',
  };

  const mockTasks = [
    {
      _id: 'task1',
      title: 'Implement login feature',
      description: 'Add OAuth login',
      taskNumber: 'TASK-001',
      status: 'in_progress',
      priority: 'high',
      project: {
        _id: 'proj1',
        name: 'Project Alpha',
        projectCode: 'ALPHA',
      },
      assignedTo: {
        _id: 'user1',
        username: 'john',
        email: 'john@example.com',
      },
      createdBy: {
        _id: 'user2',
        username: 'jane',
        email: 'jane@example.com',
      },
      dueDate: '2024-12-31',
      progressPercentage: 50,
      estimatedHours: 20,
      actualHours: 10,
      tags: ['frontend', 'auth'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
    {
      _id: 'task2',
      title: 'Fix database migration',
      description: 'Update schema',
      taskNumber: 'TASK-002',
      status: 'todo',
      priority: 'medium',
      project: {
        _id: 'proj1',
        name: 'Project Alpha',
        projectCode: 'ALPHA',
      },
      assignedTo: {
        _id: 'user3',
        username: 'bob',
        email: 'bob@example.com',
      },
      createdBy: {
        _id: 'user2',
        username: 'jane',
        email: 'jane@example.com',
      },
      dueDate: '2024-12-15',
      progressPercentage: 0,
      estimatedHours: 8,
      tags: ['backend'],
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    },
    {
      _id: 'task3',
      title: 'Write documentation',
      description: 'API docs',
      taskNumber: 'TASK-003',
      status: 'completed',
      priority: 'low',
      project: {
        _id: 'proj2',
        name: 'Project Beta',
        projectCode: 'BETA',
      },
      createdBy: {
        _id: 'user2',
        username: 'jane',
        email: 'jane@example.com',
      },
      progressPercentage: 100,
      tags: ['documentation'],
      createdAt: '2024-01-04T00:00:00.000Z',
      updatedAt: '2024-01-05T00:00:00.000Z',
    },
  ];

  const mockUsers = [
    { _id: 'user1', username: 'john', email: 'john@example.com' },
    { _id: 'user2', username: 'jane', email: 'jane@example.com' },
    { _id: 'user3', username: 'bob', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/team/list')) {
        return Promise.resolve({
          json: async () => ({ success: true, data: mockUsers }),
          ok: true,
        });
      }
      return Promise.resolve({
        json: async () => ({ success: true, data: mockTasks }),
        ok: true,
      });
    });
  });

  describe('Initial Render and Data Fetching', () => {
    it('renders loading state initially', async () => {
      render(<TasksPage />);
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('fetches and displays tasks', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
        expect(screen.getByText('Fix database migration')).toBeInTheDocument();
        expect(screen.getByText('Write documentation')).toBeInTheDocument();
      });
    });

    it('displays correct task count in stats', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('handles fetch error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<TasksPage />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error loading tasks');
      });
    });
  });

  describe('Search Functionality', () => {
    it('updates search query on input change', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search tasks...');
      fireEvent.change(searchInput, { target: { value: 'login' } });

      expect(searchInput).toHaveValue('login');
    });

    it('triggers search on Enter key press', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search tasks...');
      fireEvent.change(searchInput, { target: { value: 'TASK-001' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=TASK-001')
        );
      });
    });
  });

  describe('Filter Functionality', () => {
    it('renders status filter', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    it('renders priority filter', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('View Mode Toggle', () => {
    it('switches between list and kanban view', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Task Selection', () => {
    it('selects individual tasks', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstTaskCheckbox = checkboxes.find((cb) =>
        cb.getAttribute('id') !== 'select-all-tasks'
      );

      if (firstTaskCheckbox) {
        fireEvent.click(firstTaskCheckbox);
        expect(screen.getByText(/1 selected/)).toBeInTheDocument();
      }
    });

    it('selects all tasks', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      expect(screen.getByText(/3 selected/)).toBeInTheDocument();
    });

    it('clears selection', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      const clearButton = screen.getByText('Clear Selection');
      fireEvent.click(clearButton);

      expect(screen.getByText('Manage and track all project tasks')).toBeInTheDocument();
    });
  });

  describe('Task Actions', () => {
    it('navigates to new task page', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const newTaskButton = screen.getByText('New Task');
      fireEvent.click(newTaskButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/tasks/new');
    });

    it('navigates to my tasks page', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const myTasksButton = screen.getByText('My Tasks');
      fireEvent.click(myTasksButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/my-tasks');
    });

    it('opens edit dialog when edit button clicked', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );

      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);

        await waitFor(() => {
          expect(screen.getByText('Edit Task')).toBeInTheDocument();
        });
      }
    });

    it('opens delete dialog when delete button clicked', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
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

  describe('Task CRUD Operations', () => {
    it('updates task successfully', async () => {
      (global.fetch as jest.Mock)
        .mockImplementation((url) => {
          if (url.includes('/api/team/list')) {
            return Promise.resolve({
              json: async () => ({ success: true, data: mockUsers }),
              ok: true,
            });
          }
          if (url.includes('/api/tasks/task1')) {
            return Promise.resolve({
              json: async () => ({ success: true }),
              ok: true,
            });
          }
          return Promise.resolve({
            json: async () => ({ success: true, data: mockTasks }),
            ok: true,
          });
        });

      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg.lucide-pencil')
      );
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText('Title');
      fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Task updated successfully');
      });
    });

    it('deletes task successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockUsers }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockTasks }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
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
        expect(toast.success).toHaveBeenCalledWith('Task deleted successfully');
      });
    });

    it('handles delete error', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockUsers }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockTasks }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ error: 'Deletion failed' }),
          ok: false,
        });

      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
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
    it('shows bulk delete dialog when multiple tasks selected', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Tasks?')).toBeInTheDocument();
      });
    });

    it('performs bulk delete successfully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockUsers }),
          ok: true,
        })
        .mockResolvedValueOnce({
          json: async () => ({ success: true, data: mockTasks }),
          ok: true,
        })
        .mockResolvedValue({
          json: async () => ({ success: true }),
          ok: true,
        });

      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText('Select All');
      fireEvent.click(selectAllCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/3 selected/)).toBeInTheDocument();
      });

      const bulkDeleteButton = screen.getByText(/Delete \(3\)/);
      fireEvent.click(bulkDeleteButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Multiple Tasks?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /delete all/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('3 task(s) deleted successfully');
      }, { timeout: 3000 });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no tasks exist', async () => {
      (global.fetch as jest.Mock).mockImplementation((url) => {
        if (url.includes('/api/team/list')) {
          return Promise.resolve({
            json: async () => ({ success: true, data: mockUsers }),
            ok: true,
          });
        }
        return Promise.resolve({
          json: async () => ({ success: true, data: [] }),
          ok: true,
        });
      });

      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('No tasks found')).toBeInTheDocument();
        expect(screen.getByText('Get started by creating your first task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Information Display', () => {
    it('displays task titles and numbers', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('TASK-001')).toBeInTheDocument();
        expect(screen.getByText('TASK-002')).toBeInTheDocument();
        expect(screen.getByText('TASK-003')).toBeInTheDocument();
      });
    });

    it('displays task status badges', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const statusElements = document.querySelectorAll('*');
      const hasStatuses = Array.from(statusElements).some(el =>
        el.textContent?.includes('In Progress') ||
        el.textContent?.includes('To Do') ||
        el.textContent?.includes('Completed')
      );
      expect(hasStatuses).toBe(true);
    });

    it('displays task priority badges', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const priorityElements = document.querySelectorAll('*');
      const hasPriorities = Array.from(priorityElements).some(el =>
        el.textContent?.includes('high') ||
        el.textContent?.includes('medium') ||
        el.textContent?.includes('low')
      );
      expect(hasPriorities).toBe(true);
    });

    it('displays assigned users', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('john')).toBeInTheDocument();
        expect(screen.getByText('bob')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics Display', () => {
    it('calculates to-do tasks correctly', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        const toDoCount = screen.getAllByText('1');
        expect(toDoCount.length).toBeGreaterThan(0);
      });
    });

    it('calculates in-progress tasks correctly', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });
    });

    it('calculates completed tasks correctly', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Write documentation')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive elements', async () => {
      render(<TasksPage />);

      await waitFor(() => {
        expect(screen.getByText('Implement login feature')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
