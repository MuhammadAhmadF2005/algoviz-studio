import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkedListVisualizer } from '../LinkedListVisualizer';
import { toast } from 'sonner';

// Mock the toast function
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock the VisualizationContainer component
vi.mock('@/components/VisualizationContainer', () => ({
    VisualizationContainer: ({ title, description, controls, children }: any) => (
        <div data-testid="visualization-container">
            <h1>{title}</h1>
            <p>{description}</p>
            <div data-testid="controls">{controls}</div>
            <div data-testid="content">{children}</div>
        </div>
    ),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, variant, size, className, ...props }: any) => (
        <button onClick={onClick} className={className} {...props}>
            {children}
        </button>
    ),
}));

vi.mock('@/components/ui/input', () => ({
    Input: ({ value, onChange, onKeyPress, ...props }: any) => (
        <input
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            {...props}
        />
    ),
}));

vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ value, onValueChange, children }: any) => (
        <div data-testid="tabs" data-value={value}>
            <button
                data-testid="singly-tab"
                onClick={() => onValueChange && onValueChange('singly')}
            >
                Singly Linked
            </button>
            <button
                data-testid="doubly-tab"
                onClick={() => onValueChange && onValueChange('doubly')}
            >
                Doubly Linked
            </button>
            {children}
        </div>
    ),
    TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
    TabsTrigger: ({ value, children }: any) => (
        <div data-testid={`tab-trigger-${value}`}>{children}</div>
    ),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
    Plus: () => <span data-testid="plus-icon">+</span>,
    Trash2: () => <span data-testid="trash-icon">🗑</span>,
    ArrowRight: () => <span data-testid="arrow-right">→</span>,
    ArrowLeft: () => <span data-testid="arrow-left">←</span>,
    MoveRight: () => <span data-testid="move-right">⇒</span>,
    MoveLeft: () => <span data-testid="move-left">⇐</span>,
}));

describe('LinkedListVisualizer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('Initial Rendering', () => {
        it('renders the component with initial state', () => {
            render(<LinkedListVisualizer />);

            expect(screen.getByText('Linked List Visualizer')).toBeInTheDocument();
            expect(screen.getByText(/singly linked list/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
            expect(screen.getByText('Add at Beginning')).toBeInTheDocument();
            expect(screen.getByText('Add at End')).toBeInTheDocument();
        });

        it('displays initial nodes correctly', () => {
            render(<LinkedListVisualizer />);

            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
            expect(screen.getByText('30')).toBeInTheDocument();
        });

        it('shows HEAD label on first node in singly linked list', () => {
            render(<LinkedListVisualizer />);

            expect(screen.getByText('HEAD')).toBeInTheDocument();
            expect(screen.queryByText('TAIL')).not.toBeInTheDocument();
        });
    });

    describe('List Type Switching', () => {
        it('switches from singly to doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Click on doubly linked tab
            await user.click(screen.getByTestId('doubly-tab'));

            await waitFor(() => {
                expect(screen.getByText(/doubly linked list/i)).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(screen.getByText('TAIL')).toBeInTheDocument();
            });
        });

        it('shows backward traversal button only for doubly linked lists', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Initially singly linked - no backward traversal
            expect(screen.queryByText('Traverse Backward')).not.toBeInTheDocument();

            // Switch to doubly linked
            await user.click(screen.getByTestId('doubly-tab'));

            await waitFor(() => {
                expect(screen.getByText('Traverse Backward')).toBeInTheDocument();
            });
        });

        it('handles single node with both HEAD and TAIL labels in doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            // Delete all nodes except one
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[1]); // Delete second node
            await user.click(deleteButtons[2]); // Delete third node

            await waitFor(() => {
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(screen.getByText('TAIL')).toBeInTheDocument();
            });
        });
    });

    describe('Add Operations on Empty Lists', () => {
        it('adds first node at beginning on empty list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete all existing nodes first
            const deleteButtons = screen.getAllByTestId('trash-icon');
            for (const button of deleteButtons) {
                await user.click(button);
            }

            // Verify list is empty
            await waitFor(() => {
                expect(screen.getByText('Add nodes to visualize the linked list')).toBeInTheDocument();
            });

            // Add a node at beginning
            const input = screen.getByPlaceholderText('Enter value');
            await user.type(input, '42');
            await user.click(screen.getByText('Add at Beginning'));

            await waitFor(() => {
                expect(screen.getByText('42')).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value 42 added as the first node (HEAD)!');
            });
        });

        it('adds first node at end on empty list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete all existing nodes first
            const deleteButtons = screen.getAllByTestId('trash-icon');
            for (const button of deleteButtons) {
                await user.click(button);
            }

            // Add a node at end
            const input = screen.getByPlaceholderText('Enter value');
            await user.type(input, '99');
            await user.click(screen.getByText('Add at End'));

            await waitFor(() => {
                expect(screen.getByText('99')).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value 99 added as the first node (HEAD)!');
            });
        });

        it('adds first node with HEAD and TAIL labels in doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            // Delete all existing nodes
            const deleteButtons = screen.getAllByTestId('trash-icon');
            for (const button of deleteButtons) {
                await user.click(button);
            }

            // Add first node
            const input = screen.getByPlaceholderText('Enter value');
            await user.type(input, '55');
            await user.click(screen.getByText('Add at End'));

            await waitFor(() => {
                expect(screen.getByText('55')).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(screen.getByText('TAIL')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value 55 added as the first node (HEAD and TAIL)!');
            });
        });
    });

    describe('Single Node Scenarios', () => {
        it('handles single node deletion properly', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete all nodes except one
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[1]);
            await user.click(deleteButtons[2]);

            // Delete the last remaining node
            const remainingDeleteButton = screen.getByTestId('trash-icon');
            await user.click(remainingDeleteButton);

            await waitFor(() => {
                expect(screen.getByText('Add nodes to visualize the linked list')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value 10 deleted - list is now empty!');
            });
        });

        it('shows both HEAD and TAIL labels on single node in doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            // Delete all nodes except one
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[1]);
            await user.click(deleteButtons[2]);

            await waitFor(() => {
                expect(screen.getByText('10')).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(screen.getByText('TAIL')).toBeInTheDocument();
            });
        });

        it('handles traversal on single node', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete all nodes except one
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[1]);
            await user.click(deleteButtons[2]);

            // Test forward traversal
            await user.click(screen.getByText('Traverse Forward'));

            await waitFor(() => {
                expect(toast.info).toHaveBeenCalledWith('Starting forward traversal of 1 node...');
            });
        });
    });

    describe('Label Positioning and Delete Button Accessibility', () => {
        it('positions TAIL label above node in doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            await waitFor(() => {
                const tailLabel = screen.getByText('TAIL');
                expect(tailLabel).toBeInTheDocument();

                // Check that TAIL label has the correct positioning class
                const tailLabelElement = tailLabel.closest('.absolute');
                expect(tailLabelElement).toHaveClass('-top-8');
            });
        });

        it('ensures delete buttons are accessible without overlap', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            // All delete buttons should be clickable
            const deleteButtons = screen.getAllByTestId('trash-icon');

            for (const button of deleteButtons) {
                expect(button).toBeInTheDocument();
                // Simulate hover to ensure accessibility
                await user.hover(button);
                expect(button).toBeVisible();
            }
        });

        it('maintains proper spacing between labels and buttons', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            await waitFor(() => {
                const headLabel = screen.getByText('HEAD');
                const tailLabel = screen.getByText('TAIL');
                const deleteButtons = screen.getAllByTestId('trash-icon');

                expect(headLabel).toBeInTheDocument();
                expect(tailLabel).toBeInTheDocument();
                expect(deleteButtons).toHaveLength(3);

                // Verify all elements are visible and don't overlap
                deleteButtons.forEach(button => {
                    expect(button).toBeVisible();
                });
            });
        });
    });

    describe('Input Validation and User Feedback', () => {
        it('prevents adding nodes with empty input', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Try to add without entering a value
            await user.click(screen.getByText('Add at Beginning'));

            expect(toast.error).toHaveBeenCalledWith('Please enter a value before adding a node');
        });

        it('prevents adding nodes with invalid input', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            // Test with non-numeric input
            await user.type(input, 'abc');
            await user.click(screen.getByText('Add at Beginning'));

            expect(toast.error).toHaveBeenCalledWith('Please enter a valid integer number');
        });

        it('prevents adding nodes with decimal numbers', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '3.14');
            await user.click(screen.getByText('Add at Beginning'));

            expect(toast.error).toHaveBeenCalledWith('Please enter a whole number (decimals not allowed)');
        });

        it('prevents adding extremely large numbers', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '9999999');
            await user.click(screen.getByText('Add at Beginning'));

            expect(toast.error).toHaveBeenCalledWith('Please enter a number between -999999 and 999999');
        });

        it('shows success message when adding nodes', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '77');
            await user.click(screen.getByText('Add at Beginning'));

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith('Node with value 77 added at beginning - new HEAD node!');
            });
        });

        it('handles Enter key press for adding nodes', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '88');
            await user.keyboard('{Enter}');

            await waitFor(() => {
                expect(screen.getByText('88')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalled();
            });
        });
    });

    describe('Traversal Operations', () => {
        it('prevents traversal on empty list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete all nodes
            const deleteButtons = screen.getAllByTestId('trash-icon');
            for (const button of deleteButtons) {
                await user.click(button);
            }

            // Try to traverse
            await user.click(screen.getByText('Traverse Forward'));

            expect(toast.error).toHaveBeenCalledWith('Cannot traverse - list is empty! Add some nodes first.');
        });

        it('performs forward traversal correctly', async () => {
            vi.useFakeTimers();
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

            render(<LinkedListVisualizer />);

            await user.click(screen.getByText('Traverse Forward'));

            expect(toast.info).toHaveBeenCalledWith('Starting forward traversal of 3 nodes...');

            // Fast-forward through the traversal
            vi.advanceTimersByTime(2000);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith('Forward traversal complete! Visited 3 nodes.');
            });

            vi.useRealTimers();
        });

        it('performs backward traversal in doubly linked list', async () => {
            vi.useFakeTimers();
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            await user.click(screen.getByText('Traverse Backward'));

            expect(toast.info).toHaveBeenCalledWith('Starting backward traversal of 3 nodes...');

            // Fast-forward through the traversal
            vi.advanceTimersByTime(2000);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith('Backward traversal complete! Visited 3 nodes.');
            });

            vi.useRealTimers();
        });
    });

    describe('Delete Operations with Label Updates', () => {
        it('updates HEAD label when deleting first node', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete the first node (HEAD)
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText('10')).not.toBeInTheDocument();
                expect(screen.getByText('20')).toBeInTheDocument();
                expect(screen.getByText('HEAD')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('HEAD node (value 10) deleted - HEAD label moved to next node!');
            });
        });

        it('updates TAIL label when deleting last node in doubly linked list', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Switch to doubly linked list
            await user.click(screen.getByTestId('doubly-tab'));

            // Delete the last node (TAIL)
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[2]);

            await waitFor(() => {
                expect(screen.queryByText('30')).not.toBeInTheDocument();
                expect(screen.getByText('20')).toBeInTheDocument();
                expect(screen.getByText('TAIL')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('TAIL node (value 30) deleted - TAIL label moved to previous node!');
            });
        });

        it('handles deletion of middle nodes correctly', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            // Delete the middle node
            const deleteButtons = screen.getAllByTestId('trash-icon');
            await user.click(deleteButtons[1]);

            await waitFor(() => {
                expect(screen.queryByText('20')).not.toBeInTheDocument();
                expect(screen.getByText('10')).toBeInTheDocument();
                expect(screen.getByText('30')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value 20 deleted!');
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('handles whitespace-only input', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '   ');
            await user.click(screen.getByText('Add at Beginning'));

            expect(toast.error).toHaveBeenCalledWith('Input cannot be empty or contain only spaces');
        });

        it('handles negative numbers correctly', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            await user.type(input, '-42');
            await user.click(screen.getByText('Add at Beginning'));

            await waitFor(() => {
                expect(screen.getByText('-42')).toBeInTheDocument();
                expect(toast.success).toHaveBeenCalledWith('Node with value -42 added at beginning - new HEAD node!');
            });
        });

        it('maintains proper node relationships after multiple operations', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            // Add at beginning
            await user.type(input, '5');
            await user.click(screen.getByText('Add at Beginning'));

            // Add at end
            await user.clear(input);
            await user.type(input, '35');
            await user.click(screen.getByText('Add at End'));

            await waitFor(() => {
                const nodes = screen.getAllByText(/^-?\d+$/).map(el => el.textContent);
                expect(nodes).toEqual(['5', '10', '20', '30', '35']);
                expect(screen.getByText('HEAD')).toBeInTheDocument();
            });
        });

        it('handles rapid successive operations', async () => {
            const user = userEvent.setup();
            render(<LinkedListVisualizer />);

            const input = screen.getByPlaceholderText('Enter value');

            // Rapidly add multiple nodes
            for (let i = 1; i <= 3; i++) {
                await user.clear(input);
                await user.type(input, i.toString());
                await user.click(screen.getByText('Add at End'));
            }

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
                expect(screen.getByText('2')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument();
            });
        });
    });
});