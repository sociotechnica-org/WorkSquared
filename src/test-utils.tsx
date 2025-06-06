import '@testing-library/jest-dom';
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LiveStoreProvider, createStore } from '@livestore/react';
import { WebPlatformAdapter } from '@livestore/adapter-web';

// Mock LiveStore for testing
const createTestStore = () => {
  const adapter = new WebPlatformAdapter({
    namespace: 'test',
    storage: 'memory',
  });
  
  return createStore({
    adapter,
    tableSchemas: {
      todos: {
        id: 'string',
        text: 'string',
        completed: 'boolean',
        createdAt: 'number',
      },
      chatMessages: {
        id: 'string',
        role: 'string',
        content: 'string',
        modelId: 'string?',
        timestamp: 'number',
        metadata: 'json?',
      },
      uiState: {
        todoFilter: 'string',
        currentModelId: 'string?',
      },
    },
  });
};

interface TestProviderProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createStore>;
}

function TestProvider({ children, store }: TestProviderProps) {
  const testStore = store || createTestStore();
  
  return (
    <LiveStoreProvider store={testStore}>
      {children}
    </LiveStoreProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { store?: ReturnType<typeof createStore> }
) => {
  const { store, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => <TestProvider store={store}>{children}</TestProvider>,
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, createTestStore };