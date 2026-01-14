# GitHub Copilot Custom Instructions

## Project Overview
This is **GoldenLogicUi**, a Vue.js UI component library built with Vite. It provides reusable components for building web applications.

## Tech Stack
- **Framework**: Vue 3 (Composition API preferred)
- **Build Tool**: Vite
- **State Management**: Vuex (store module)
- **Styling**: Tailwind CSS

## Project Structure
- `src/components/GeneralComponents/` - Reusable UI components (prefixed with `Gl`)
- `src/components/GeneralComponents/DataTable/` - Data table related components
- `src/components/LaravelVuePagination/` - Pagination components
- `src/store/` - Vuex store (actions, mutations, getters)
- `src/Stores/` - Additional stores (Pinia-style)
- `src/print/` - Print utilities

## Coding Conventions

### Component Naming
- All general components are prefixed with `Gl` (e.g., `GlButton`, `GlModal`, `GlTextInput`)
- DataTable components are prefixed with `Datatable` (e.g., `DatatableAction`, `DatatableStatus`)
- Use PascalCase for component file names

### Vue Component Guidelines
- Prefer Vue 3 Composition API with `<script setup>` syntax
- Use single-file components (`.vue` files)
- Keep components focused and reusable
- Props should be well-documented with types and defaults

### Code Style
- Use camelCase for variables and functions
- Use PascalCase for component names and classes
- Use kebab-case for custom events
- Prefer template syntax over render functions

### Component Props Pattern
```vue
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})
```

### Event Emission Pattern
```vue
const emit = defineEmits(['update:modelValue', 'change', 'blur'])
```

## Common Patterns

### Modal Components
- Use `GlModal` as base for modal dialogs
- Support `v-model` for open/close state
- Include confirmation modals for destructive actions

### Form Components
- Support `v-model` for two-way binding
- Include validation states
- Support multilingual content where applicable

### DataTable Components
- Render specific cell types (dates, status, actions, files)
- Support custom formatting and actions

## Testing
- Test components in isolation
- Verify props and events work correctly
- Test edge cases and error states

## Accessibility
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain proper focus management in modals
