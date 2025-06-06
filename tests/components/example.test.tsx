import { describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, createTestStore } from '../../src/test-utils';
import { useQuery } from '@livestore/react';

// Example component for testing
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p data-testid="count">Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

describe('Counter Component', () => {
  it('should render initial count', () => {
    render(<Counter />);
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 0');
  });

  it('should increment count on button click', () => {
    render(<Counter />);
    
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });
});

// Example test with LiveStore

function TodoCount() {
  const todos = useQuery((db) => db.table('todos').all());
  
  return <div data-testid="todo-count">Todos: {todos.length}</div>;
}

describe('TodoCount Component with LiveStore', () => {
  it('should show todo count', async () => {
    const store = createTestStore();
    
    // Add test data
    await store.mutate([
      { type: 'todo.add', id: '1', text: 'Test todo', completed: false },
    ]);
    
    render(<TodoCount />, { store });
    
    expect(screen.getByTestId('todo-count')).toHaveTextContent('Todos: 1');
  });
});