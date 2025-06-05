# Work Squared Implementation Todos - Phase 1 & 2 Parallel

## Quick Reference
- **Design Doc**: [work-squared-demo-design.md](./work-squared-demo-design.md)
- **Goal**: Build chat system AND Kanban board in parallel
- **Strategy**: Vertical slices - each issue includes events → UI → tests
- **Approach**: 2 Claude instances working on independent tracks

## Parallelization Strategy

1. **Instance 1**: Owns Chat/LLM system (Phase 1)
2. **Instance 2**: Owns Kanban board system (Phase 2)
3. **Both**: Work on vertical slices independently
4. **Day 3-4**: Integration and polish together

## Shared Setup (Day 0 - Both Instances)

### Priority 0: Cloudflare Deployment (Do First!)

#### Issue #0: Deploy to Cloudflare Pages
**Branch**: `feat/cloudflare-deploy`
**Time**: 1-2 hours
**Assignee**: Either instance
**Critical**: This enables PR preview deployments for all subsequent work

Tasks:
- [ ] Connect GitHub repo to Cloudflare Pages
- [ ] Configure build settings:
  - Build command: `pnpm build`
  - Build output directory: `dist`
  - Root directory: `/`
- [ ] Set up environment variables in Cloudflare dashboard:
  - `VITE_LIVESTORE_SYNC_URL` = `https://worksquared.your-subdomain.workers.dev`
- [ ] Configure preview deployments for all PRs
- [ ] Test deployment with current main branch
- [ ] Add deployment URLs to README

Benefits:
- **Every PR gets a unique preview URL** for QA
- **Real environment** for testing WebSocket sync
- **No local setup needed** for reviewers

---

### Shared Interfaces & Setup

#### Issue #S1: Core Types and Interfaces
**Branch**: `feat/core-types`
**Time**: 1 hour
**Assignee**: Both review together

Create shared types that both tracks will use:

```typescript
// src/types/index.ts
export interface BaseEvent {
  id: string
  timestamp: number
  userId?: string
}

export interface Model {
  id: string
  name: string
}

// src/types/chat.ts
export interface ChatMessageEvent extends BaseEvent {
  type: 'chat.message'
  role: 'user' | 'assistant' | 'system'
  content: string
  modelId?: string
  metadata?: Record<string, any>
}

// src/types/kanban.ts
export interface TaskEvent extends BaseEvent {
  type: 'task.created' | 'task.updated' | 'task.moved' | 'task.deleted'
  taskId: string
  boardId: string
  data: Partial<Task>
}

export interface Task {
  id: string
  title: string
  description?: string
  column: string
  position: number
}
```

---

## Track A: Chat System (Instance 1)

### Issue #A1: Basic Chat Message Flow
**Branch**: `feat/chat-messages`
**Time**: 4-6 hours
**Deliverable**: Users can send messages and see them appear

Tasks:
- [ ] LiveStore setup:
  - [ ] Add ChatMessageEvent to `src/livestore/events.ts`
  - [ ] Add chatMessages table to schema
  - [ ] Create getChatMessages query
  - [ ] Unit tests for materialization
- [ ] UI Components:
  - [ ] Create `src/components/chat/ChatContainer.tsx` (main layout)
  - [ ] Create `src/components/chat/ChatMessages.tsx` (message list)
  - [ ] Create `src/components/chat/ChatMessage.tsx` (individual message)
  - [ ] Create `src/components/chat/ChatInput.tsx` (input field)
  - [ ] Add to MainSection with split view
- [ ] Integration:
  - [ ] Wire ChatInput to dispatch events
  - [ ] Connect ChatMessages to LiveStore query
  - [ ] Add mock assistant responses for now
- [ ] Tests:
  - [ ] Unit tests for components
  - [ ] E2E test: Send message and see it appear

PR must include:
- Screenshot of working chat
- All tests passing
- Preview deployment URL

### Issue #A2: LLM Integration with Streaming
**Branch**: `feat/llm-integration`
**Time**: 4-6 hours
**Deliverable**: Real LLM responses with streaming

Tasks:
- [ ] Service implementation:
  - [ ] Create `src/services/llm/llm-service.ts`
  - [ ] Add Anthropic SDK integration
  - [ ] Implement streaming response handler
  - [ ] Create mock service for tests
- [ ] Event updates:
  - [ ] Add streaming metadata to ChatMessageEvent
  - [ ] Handle partial content updates
  - [ ] Add error event types
- [ ] UI updates:
  - [ ] Show typing indicator during streaming
  - [ ] Update message progressively
  - [ ] Handle error states gracefully
- [ ] Configuration:
  - [ ] Add VITE_ANTHROPIC_API_KEY to env
  - [ ] Update `.env.example`
  - [ ] Add API key to Cloudflare deployment
- [ ] Tests:
  - [ ] Unit tests with mock LLM
  - [ ] E2E test: Full conversation flow

### Issue #A3: Model Picker and Chat Polish
**Branch**: `feat/model-picker`
**Time**: 3-4 hours
**Deliverable**: Can switch between models, polished chat UX

Tasks:
- [ ] Model selection:
  - [ ] Create `src/components/chat/ModelPicker.tsx`
  - [ ] Add model state to LiveStore
  - [ ] Wire up model switching
  - [ ] Show current model in chat
- [ ] Chat improvements:
  - [ ] Add message timestamps
  - [ ] Implement message retry on error
  - [ ] Add copy button to messages
  - [ ] Markdown rendering for responses
- [ ] Activity tracking:
  - [ ] Add model change events
  - [ ] Track token usage (if available)
- [ ] Tests:
  - [ ] Test model switching
  - [ ] Test markdown rendering
  - [ ] E2E: Switch model mid-conversation

### Issue #A4: Chat Activity Log
**Branch**: `feat/chat-activity`
**Time**: 3-4 hours
**Deliverable**: Activity panel showing chat events

Tasks:
- [ ] Create activity components:
  - [ ] `src/components/activity/ActivityPanel.tsx`
  - [ ] `src/components/activity/ChatActivityItem.tsx`
  - [ ] Filter controls for event types
- [ ] Connect to events:
  - [ ] Query all chat-related events
  - [ ] Real-time updates
  - [ ] Show event details on click
- [ ] Polish:
  - [ ] Smooth animations
  - [ ] Clear event descriptions
  - [ ] Timestamp formatting
- [ ] Tests:
  - [ ] Activity appears for all chat actions
  - [ ] Filtering works correctly

---

## Track B: Kanban System (Instance 2)

### Issue #B1: Basic Kanban Board
**Branch**: `feat/kanban-board`
**Time**: 4-6 hours
**Deliverable**: Working Kanban board with drag-and-drop

Tasks:
- [ ] LiveStore setup:
  - [ ] Add Task events to `src/livestore/events.ts`
  - [ ] Add boards, columns, tasks tables to schema
  - [ ] Create board queries (getTasks, getColumns)
  - [ ] Unit tests for materialization
- [ ] UI Components:
  - [ ] Create `src/components/kanban/KanbanBoard.tsx`
  - [ ] Create `src/components/kanban/KanbanColumn.tsx`
  - [ ] Create `src/components/kanban/TaskCard.tsx`
  - [ ] Implement drag-and-drop (react-beautiful-dnd or similar)
  - [ ] Add to MainSection (below or beside chat)
- [ ] Initial data:
  - [ ] Create default board with columns
  - [ ] Seed with example tasks
- [ ] Tests:
  - [ ] Unit tests for components
  - [ ] E2E test: Drag task between columns

PR must include:
- Screenshot/GIF of drag-and-drop
- All tests passing
- Preview deployment URL

### Issue #B2: Task CRUD Operations
**Branch**: `feat/task-crud`
**Time**: 4-6 hours
**Deliverable**: Can create, edit, delete tasks

Tasks:
- [ ] Create task:
  - [ ] Add "+" button to columns
  - [ ] Create `src/components/kanban/TaskModal.tsx`
  - [ ] Quick-add with just title
  - [ ] Full form for description
- [ ] Edit task:
  - [ ] Click task to open modal
  - [ ] Edit title and description
  - [ ] Show created/updated timestamps
- [ ] Delete task:
  - [ ] Add delete button (with confirmation)
  - [ ] Soft delete (archive) vs hard delete
- [ ] Events for all operations:
  - [ ] Emit appropriate events
  - [ ] Update UI optimistically
  - [ ] Handle conflicts gracefully
- [ ] Tests:
  - [ ] CRUD operations work correctly
  - [ ] Events are emitted properly
  - [ ] UI updates in real-time

### Issue #B3: LLM Kanban Tools
**Branch**: `feat/kanban-tools`
**Time**: 4-6 hours
**Deliverable**: LLM can manipulate Kanban board

Tasks:
- [ ] Tool definitions:
  - [ ] Create `src/tools/kanban-tools.ts`
  - [ ] Define tool schemas for LLM
  - [ ] Implement tool handlers
- [ ] Available tools:
  - [ ] createTask(title, description, column)
  - [ ] moveTask(taskId, toColumn)
  - [ ] updateTask(taskId, updates)
  - [ ] listTasks(column?)
- [ ] Integration with chat:
  - [ ] Parse tool calls from LLM responses
  - [ ] Execute tools and emit events
  - [ ] Show tool usage in chat UI
- [ ] Tests:
  - [ ] Tools execute correctly
  - [ ] Board updates from tool calls
  - [ ] Error handling for invalid operations

### Issue #B4: Kanban Activity Log
**Branch**: `feat/kanban-activity`
**Time**: 3-4 hours
**Deliverable**: Activity panel showing Kanban events

Tasks:
- [ ] Create activity components:
  - [ ] `src/components/activity/KanbanActivityItem.tsx`
  - [ ] Visual indicators for different events
  - [ ] Link to affected tasks
- [ ] Event descriptions:
  - [ ] "Task 'X' created in Backlog"
  - [ ] "Task 'Y' moved to In Progress"
  - [ ] "Task 'Z' updated by AI"
- [ ] Integration:
  - [ ] Merge with chat activity log
  - [ ] Unified filtering
  - [ ] Chronological order
- [ ] Tests:
  - [ ] All Kanban events appear
  - [ ] Can filter by event type
  - [ ] Links work correctly

---

## Integration Phase (Both Instances)

### Issue #I1: Connect Chat to Kanban Tools
**Branch**: `feat/chat-kanban-integration`
**Time**: 2-3 hours
**Assignee**: Both collaborate

Tasks:
- [ ] Register Kanban tools with LLM
- [ ] Update system prompt
- [ ] Test tool execution from chat
- [ ] Update activity log to show connections
- [ ] Demo script for tool usage

### Issue #I2: Unified Activity Log
**Branch**: `feat/unified-activity`
**Time**: 2-3 hours
**Assignee**: Either instance

Tasks:
- [ ] Merge activity streams
- [ ] Consistent styling
- [ ] Advanced filtering
- [ ] Export activity log
- [ ] Performance optimization

### Issue #I3: Demo Polish & Workflow
**Branch**: `feat/demo-polish`
**Time**: 3-4 hours
**Assignee**: Both collaborate

Tasks:
- [ ] Create demo reset button
- [ ] Add sample conversation starters
- [ ] Polish all UI transitions
- [ ] Create demo video script
- [ ] Final bug fixes

---

## Execution Sequence

### Phase 0: Setup (Both Instances)
1. Issue #0 - Cloudflare deployment
2. Issue #S1 - Shared interfaces

### Phase 1: Core Features (Parallel)
- **Instance 1**: A1 → A2 (Chat foundation → LLM integration)
- **Instance 2**: B1 → B2 (Kanban board → CRUD operations)

### Phase 2: Enhancement (Parallel)
- **Instance 1**: A3 → A4 (Model picker → Activity log)
- **Instance 2**: B3 → B4 (LLM tools → Activity log)

### Phase 3: Integration (Both)
- I1 → I2 → I3 (Connect systems → Unified experience → Demo polish)

## Success Metrics

- [ ] Can have a conversation with AI
- [ ] Can manipulate Kanban board manually
- [ ] AI can create and move tasks via chat
- [ ] All events visible in activity log
- [ ] Multi-tab sync works perfectly
- [ ] 5-minute demo runs smoothly
- [ ] Zero merge conflicts lasted > 1 hour

## Coordination Guidelines

1. **Daily Syncs**: 15-min check-in on patterns/blockers
2. **Shared Patterns**: Document in CLAUDE.md as discovered
3. **PR Reviews**: Each instance reviews the other's PRs
4. **Integration Testing**: Test preview URLs across features
5. **Conflict Resolution**: Latest PR resolves conflicts

## Notes

- Each PR should be deployable and demoable
- Keep commits focused: `feat(chat): add streaming support`
- Update preview URL in PR description
- Screenshot/GIF for all UI changes
- Run `pnpm test` before pushing