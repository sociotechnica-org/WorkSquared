import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { LiveStoreProvider, createStore } from '@livestore/react';
import { WebPlatformAdapter } from '@livestore/adapter-web';
import 'todomvc-app-css/index.css';

// Create a store for Storybook
const createStorybookStore = () => {
  const adapter = new WebPlatformAdapter({
    namespace: 'storybook',
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
      tasks: {
        id: 'string',
        boardId: 'string',
        column: 'string',
        title: 'string',
        description: 'string?',
        position: 'number',
        updatedAt: 'number',
      },
      uiState: {
        todoFilter: 'string',
        currentModelId: 'string?',
      },
    },
  });
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const store = createStorybookStore();
      
      return (
        <LiveStoreProvider store={store}>
          <Story />
        </LiveStoreProvider>
      );
    },
  ],
};

export default preview;