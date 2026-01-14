# GoldenLogicUi Library - AI Copilot Instructions

> **Copy this file to your project's `.github/copilot-instructions.md` to enable AI assistance with GoldenLogicUi components.**

## Overview
This project uses **GoldenLogicUi**, a Vue.js UI component library. All components are prefixed with `Gl` and support dark mode, Tailwind CSS styling, and v-model binding.

## Installation & Setup
```bash
npm install golden-logic-ui
```

Import and use components globally or locally in your Vue 3 project.

## Component Naming
Components can be used in multiple formats:
- **PascalCase**: `<GlTextInput />`, `<GlDropdown />`, `<GlButton />`
- **kebab-case with prefix**: `<gl-text-input />`, `<gl-dropdown />`, `<gl-button />`
- **kebab-case without prefix**: `<text-input />`, `<dropdown />`, `<toggle-box />`

The examples below use various formats interchangeably.

---

## Form Class (Error Handling)

The library includes a `Form` class for handling form submissions and validation errors.

### Creating a Form
```javascript
import Form from 'golden-logic-ui/Form'

const form = new Form({
  name: '',
  email: '',
  category_id: null,
  is_active: 1
})
```

### Form Methods
| Method | Description |
|--------|-------------|
| `form.data()` | Get all form data as object |
| `form.reset()` | Reset all fields to empty and clear errors |
| `form.post(url)` | Submit form via POST request |
| `form.put(url)` | Submit form via PUT request |
| `form.patch(url)` | Submit form via PATCH request |
| `form.delete(url)` | Submit form via DELETE request |

### Error Methods
| Method | Description |
|--------|-------------|
| `form.errors.get('field')` | Get error message for a field |
| `form.errors.has('field')` | Check if field has error |
| `form.errors.clear('field')` | Clear error for specific field |
| `form.errors.clear()` | Clear all errors |
| `form.errors.any()` | Check if any errors exist |
| `form.errors.all()` | Get all errors object |
| `form.errors.record(errors)` | Record errors from server response |

### Usage with Components
```vue
<text-input
  v-model="form.name"
  field_name="name"
  label_name="Name"
  :is_required="true"
  :error_message="form.errors.get('name')"
  @keydown="form.errors.clear('name')"
/>
```

---

## Component Reference

### Form Components

#### GlTextInput / text-input
Text input field with label, validation, and v-model support.

```vue
<!-- With Form class (recommended) -->
<text-input
  v-model="form.name"
  field_name="name"
  label_name="Full Name"
  placeholder="Enter your name"
  :is_required="true"
  :show="false"
  :error_message="form.errors.get('name')"
  @keydown="form.errors.clear('name')"
/>

<!-- With reactive errors object -->
<gl-text-input
  v-model="form.name"
  field_name="name"
  label_name="Full Name"
  placeholder="Enter your name"
  :is_required="true"
  :error_message="errors.name"
  description="Your legal full name"
  type="text"
  container_class="mb-4"
  inputGroupType="prepend"
  inputGroupText="@"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Number | `""` | v-model binding value |
| `field_name` | String | `""` | Input name/id attribute |
| `label_name` | String | `""` | Label text above input |
| `placeholder` | String | `""` | Placeholder text |
| `type` | String | `"text"` | Input type (text, email, password, number, etc.) |
| `is_required` | Boolean | `false` | Shows required indicator (*) |
| `error_message` | String | `""` | Validation error message (red styling when set) |
| `description` | String | `""` | Helper text below input |
| `show` | Boolean | `false` | Display mode (read-only display) |
| `minlength` | String | `null` | Minimum character length |
| `maxlength` | String | `null` | Maximum character length |
| `container_class` | String | `""` | Additional CSS classes for container |
| `input_class` | String | `""` | Additional CSS classes for input |
| `inputGroupType` | String | `""` | Input group type: `"prepend"` or `"append"` |
| `inputGroupText` | String | `""` | Text/HTML for input group addon |

**Events:**
- `update:modelValue` - Emitted on input change
- `keydown` - Keyboard events
- `keyup` - Keyboard events
- `blur-sm` - Blur event

---

#### GlTextarea / gl-textarea / textarea
Multi-line text input field.

```vue
<gl-textarea
  v-model="form.prompt_template"
  field_name="prompt_template"
  label_name="Prompt Template"
  placeholder="Enter your prompt template"
  :is_required="true"
  :show="false"
  :error_message="form.errors.get('prompt_template')"
  @keydown="form.errors.clear('prompt_template')"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Number | `""` | v-model binding value |
| `field_name` | String | `""` | Textarea name/id |
| `label_name` | String | `""` | Label text |
| `placeholder` | String | `""` | Placeholder text |
| `is_required` | Boolean | `false` | Required indicator |
| `error_message` | String | `""` | Validation error |
| `description` | String | `""` | Helper text |
| `show` | Boolean | `false` | Read-only display mode |

---

#### GlDropdown / dropdown
Searchable select dropdown with keyboard navigation.

```vue
<dropdown
  v-model="form.ai_provider_id"
  field_name="ai_provider_id"
  label_name="AI Provider"
  :options="aiProviderOptions"
  placeholder="Select AI Provider"
  :is_required="true"
  :show="false"
  :error_message="form.errors.get('ai_provider_id')"
  @selectionChanged="form.errors.clear('ai_provider_id')"
  option-label="name"
  option-value="id"
  :has_cancel="true"
  search_input_placeholder="Search..."
  no_results_found_placeholder="No results found"
/>
```

**Options format:**
```javascript
const categories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Books' }
]
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Number | `""` | Selected option id (v-model) |
| `options` | Array | `[]` | Array of `{ id, name }` objects |
| `field_name` | String | `""` | Input name/id |
| `label_name` | String | `""` | Label text |
| `placeholder` | String | `"Please select an option"` | Placeholder text |
| `search_input_placeholder` | String | `"Search ..."` | Search input placeholder |
| `no_results_found_placeholder` | String | `"No results found"` | Empty results text |
| `option-label` | String | `"name"` | Property name for option display text |
| `option-value` | String | `"id"` | Property name for option value |
| `is_required` | Boolean | `false` | Required indicator |
| `has_cancel` | Boolean | `true` | Show clear (X) button |
| `error_message` | String | `""` | Validation error |
| `description` | String | `""` | Helper text |
| `show` | Boolean | `false` | Read-only display mode |
| `hide_search` | Boolean | `false` | Hide search input |
| `api_url` | String | `""` | API URL for remote data fetching |
| `defaultValue` | String, Number | `""` | Default selected value |
| `maxItem` | Number | `10000` | Maximum items to display |

**Events:**
- `update:modelValue` - Selected id changed
- `selected` - Full selected object emitted
- `selectionChanged` - Selection changed event

---

#### GlMultiSelectDropdown
Multi-select dropdown with search, select all, and deselect all.

```vue
<GlMultiSelectDropdown
  v-model="form.tag_ids"
  field_name="tag_ids"
  label_name="Tags"
  :options="tags"
  placeholder="Select tags"
  :is_required="true"
  :error_message="errors.tags"
  :language="{ select_all: 'Select All', deselect_all: 'Deselect All' }"
  @selected="onTagsSelected"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Array | `[]` | Array of selected ids (v-model) |
| `options` | Array | `[]` | Array of `{ id, name }` objects |
| `field_name` | String | `""` | Input name |
| `label_name` | String | `""` | Label text |
| `is_required` | Boolean | `false` | Required indicator |
| `error_message` | String | `""` | Validation error |
| `show` | Boolean | `false` | Read-only mode |
| `language` | Object | `{}` | Custom labels: `{ select_all, deselect_all }` |
| `search_input_placeholder` | String | `"Search ..."` | Search placeholder |

**Events:**
- `update:modelValue` - Array of selected ids
- `selected` - Array of selected objects

---

#### GlDatePicker
Date picker with calendar popup, date constraints, and multiple formats.

```vue
<GlDatePicker
  v-model="form.birth_date"
  field_name="birth_date"
  label_name="Birth Date"
  placeholder="Select date"
  date_format="YYYY-MM-DD"
  :min_date="'-100y'"
  :max_date="'today'"
  :disabled_days="[0, 6]"
  :disabled_dates="['2026-01-01', '2026-12-25']"
  locale="en"
  :is_required="true"
  :error_message="errors.birth_date"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Date | `""` | Selected date (v-model) |
| `field_name` | String | `""` | Input name/id |
| `label_name` | String | `""` | Label text |
| `placeholder` | String | `"Select date"` | Placeholder text |
| `date_format` | String | `"YYYY-MM-DD"` | Date format (YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY, DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD) |
| `min_date` | String | `null` | Minimum date: "YYYY-MM-DD" or relative: "+3m", "-1y", "+7d", "today" |
| `max_date` | String | `null` | Maximum date: same format as min_date |
| `disabled_days` | Array | `[]` | Disabled weekdays (0=Sunday, 6=Saturday) |
| `disabled_dates` | Array | `[]` | Array of disabled date strings |
| `locale` | String | `"en"` | Locale for month/day names |
| `is_required` | Boolean | `false` | Required indicator |
| `error_message` | String | `""` | Validation error |
| `description` | String | `""` | Helper text |
| `show` | Boolean | `false` | Read-only mode |

**Events:**
- `update:modelValue` - Date string changed
- `change` - Date changed event
- `blur-sm` - Blur event

---

#### GlToggleBox / toggle-box
Toggle switch / checkbox component.

```vue
<toggle-box
  v-model="form.status"
  field_name="status"
  label_name="Status"
  :is_required="false"
  :show="false"
  :has_label_up="false"
  :error_message="form.errors.get('status')"
  description="Enable or disable this item"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Number | `""` | Toggle value (1 or 0) (v-model) |
| `field_name` | String | `""` | Input name/id |
| `label_name` | String | `""` | Label text |
| `has_label_up` | Boolean | `false` | Show label above toggle |
| `is_required` | Boolean | `false` | Required indicator |
| `error_message` | String | `""` | Validation error |
| `description` | String | `""` | Helper text |
| `show` | Boolean | `false` | Read-only mode |

**Events:**
- `update:modelValue` - Value changed (1 or 0)

---

#### GlTextTranslate
Input with translation support for multilingual content.

```vue
<GlTextTranslate
  v-model="form.name"
  v-model:modelValueTranslate="form.name_translations"
  field_name="name"
  label_name="Name"
  :translatable="{ ar: 'Arabic', fr: 'French' }"
  :is_required="true"
  :error_message="errors.name"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String, Number | `""` | Main value (v-model) |
| `modelValueTranslate` | String, Object | `""` | Translation values |
| `field_name` | String | `""` | Input name |
| `label_name` | String | `""` | Label text |
| `translatable` | Object | `null` | Language codes and names: `{ ar: 'Arabic', fr: 'French' }` |
| `is_required` | Boolean | `false` | Required indicator |
| `error_message` | String | `""` | Validation error |

---

#### FilesUpload
Drag and drop file upload component.

```vue
<FilesUpload
  v-model="form.files"
  field_name="documents"
  label_name="Documents"
  :has_multiple_file="true"
  :is_required="true"
  :is_enable_delete="true"
  :error_message="errors.documents"
  description="Upload PDF, DOC, or images"
  upload_url="/api/upload"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | Array | `[]` | Uploaded files array (v-model) |
| `field_name` | String | `""` | Input name |
| `label_name` | String | `""` | Label text |
| `has_multiple_file` | Boolean | `true` | Allow multiple files |
| `is_required` | Boolean | `false` | Required indicator |
| `is_enable_delete` | Boolean | `true` | Allow file deletion |
| `error_message` | String | `""` | Validation error |
| `description` | String | `""` | Helper text |
| `upload_url` | String | `""` | Upload endpoint URL |

---

### Button Component

#### GlButton
Versatile button component with loading states and multiple styles.

```vue
<GlButton
  button_type="primary"
  :is_loading="isSubmitting"
  :is_disabled="!isValid"
  :is_submit="true"
  icon="fas fa-save"
  form_id="myForm"
>
  Save Changes
</GlButton>
```

**Button Types:**
- `default` - Blue primary button
- `primary` - Custom primary color
- `alternative` - White with border
- `dark` - Dark gray button
- `light` - Light gray button
- `green` - Green success button
- `red` - Red danger button
- `yellow` - Yellow warning button
- `purple` - Purple button

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `button_type` | String | `"default"` | Button style variant |
| `is_submit` | Boolean | `false` | Submit button type |
| `is_loading` | Boolean | `false` | Show loading spinner |
| `is_disabled` | Boolean | `false` | Disable button |
| `icon` | String | `""` | Font Awesome icon class |
| `svg_icon` | String | `""` | Custom SVG icon HTML |
| `tag` | String | `"button"` | HTML tag (button, a) |
| `href` | String | `""` | Link URL (when tag="a") |
| `has_border_reduced` | Boolean | `true` | Rounded corners |
| `classes` | String | `""` | Additional CSS classes |
| `form_id` | String | `""` | Form ID to attach loading state |

**Examples:**
```vue
<!-- Submit Button with Loading -->
<GlButton button_type="primary" :is_submit="true" :is_loading="loading">
  Submit
</GlButton>

<!-- Link Button -->
<GlButton button_type="light" tag="a" href="/dashboard">
  Go to Dashboard
</GlButton>

<!-- Icon Button -->
<GlButton button_type="green" icon="fas fa-plus">
  Add Item
</GlButton>

<!-- Danger Button -->
<GlButton button_type="red" @click="deleteItem">
  Delete
</GlButton>
```

---

### Modal Components

#### GlModal / modal
General purpose modal dialog with body and buttons slots.

```vue
<modal 
  :is_open="isOpenUpdate" 
  @closeModal="isOpenUpdate = false" 
  title="Update AI Task"
  max_width="w-full"
  :is_loading="isLoading"
>
  <template v-slot:body>
    <div class="mb-4">
      <dropdown 
        v-model="form.type"
        :options="taskTypeOptions" 
        :is_required="true"
        :show="false"
        field_name="type" 
        label_name="Task Type" 
        placeholder="Select task type"
        :error_message="form.errors.get('type')"
        @selectionChanged="form.errors.clear('type')"
      />
    </div>

    <div class="mb-4">
      <text-input 
        v-model="form.name"
        type="text" 
        :is_required="true" 
        :show="false"
        field_name="name" 
        label_name="Task Name"
        :error_message="form.errors.get('name')"
        @keydown="form.errors.clear('name')"
      />
    </div>

    <div class="mb-4">
      <gl-textarea
        v-model="form.description"
        :is_required="true"
        :show="false"
        field_name="description"
        label_name="Description"
        placeholder="Enter description"
        :error_message="form.errors.get('description')"
        @keydown="form.errors.clear('description')"
      />
    </div>
  </template>

  <template v-slot:buttons>
    <gl-button 
      @click="submitForm()" 
      tag="button" 
      button_type="primary" 
      icon="fa-solid fa-save"
      :is_loading="isLoading"
    >
      Save Changes
    </gl-button>
  </template>
</modal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `is_open` | Boolean | `false` | Control modal visibility |
| `title` | String | `""` | Modal title |
| `max_width` | String | `"max-w-2xl"` | Tailwind width class (e.g., `w-full`, `max-w-lg`, `max-w-4xl`) |
| `is_loading` | Boolean | `false` | Show loading skeleton |
| `hide_model_footer` | Boolean | `false` | Hide footer area |
| `bodyClass` | String | `"p-4"` | Body container classes |
| `has_large_z_index` | Boolean | `false` | Higher z-index (z-9999) |
| `language` | Object | `{}` | Custom labels |

**Slots:**
| Slot | Description |
|------|-------------|
| `v-slot:body` | Modal body content |
| `v-slot:buttons` | Footer buttons area |

**Events:**
- `closeModal` - Emitted when close button clicked

---

#### GlDeleteConfirmationModal / DeleteConfirmationModal
Pre-styled delete confirmation dialog.

```vue
<GlDeleteConfirmationModal
  :isOpen="open_delete_modal"
  @confirm-delete="deleteAction"
  @cancel-delete="closeDeleteModal"
  :language="{
    title_delete_confirmation: 'Confirm Deletion',
    message_delete_confirmation: 'Are you sure you want to delete this item?',
    okbutton_delete_confirmation: 'Delete',
    cancelbutton_delete_confirmation: 'Cancel'
  }"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Control visibility |
| `language` | Object | `{}` | Custom labels |

**Events:**
- `confirm-delete` - User confirmed deletion
- `cancel-delete` - User cancelled

**Usage Example:**
```vue
<script setup>
import { ref } from 'vue'
import { GlToast } from 'golden-logic-ui'

const open_delete_modal = ref(false)
const itemToDelete = ref(null)

const openDeleteModal = (item) => {
  itemToDelete.value = item
  open_delete_modal.value = true
}

const deleteAction = async () => {
  await axios.delete(`/api/items/${itemToDelete.value.id}`)
  open_delete_modal.value = false
  GlToast.methods.add({ message: 'Deleted successfully!', type: 'success', duration: 5000 })
}

const closeDeleteModal = () => {
  open_delete_modal.value = false
}
</script>

<template>
  <gl-button button_type="red" @click="openDeleteModal(item)">Delete</gl-button>
  
  <GlDeleteConfirmationModal
    :isOpen="open_delete_modal"
    @confirm-delete="deleteAction"
    @cancel-delete="closeDeleteModal"
  />
</template>
```

---

#### ConfirmationModal
General confirmation dialog with custom content.

```vue
<ConfirmationModal
  :isOpen="showConfirmModal"
  title="Confirm Action"
  button_text="Proceed"
  @confirm-action="handleConfirm"
  @cancel-action="showConfirmModal = false"
>
  <p>Are you sure you want to proceed with this action?</p>
</ConfirmationModal>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Control visibility |
| `title` | String | `""` | Modal title |
| `button_text` | String | `""` | Confirm button text |

**Events:**
- `confirm-action` - User confirmed
- `cancel-action` - User cancelled

---

### Layout Components

#### GlCard / Card
Card container with header and body slots.

```vue
<Card>
  <template #header>
    <div class="flex justify-between mb-6">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-300">
          AI Tasks
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and execute AI-powered tasks
        </p>
      </div>
      <div>
        <gl-button
          tag="button"
          @click="isOpen = true"
          button_type="primary"
          icon="fa-solid fa-plus"
        >Add AI Task</gl-button>
      </div>
    </div>
  </template>

  <template #body>
    <!-- Card body content -->
    <p>Content goes here</p>
  </template>
</Card>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | String | `""` | Container CSS classes |
| `body_class` | String | `""` | Body CSS classes |

**Slots:**
| Slot | Description |
|------|-------------|
| `#header` | Card header content |
| `#body` | Card body content |

---

#### GlTabsWrapper & GlTab
Tabbed interface components.

```vue
<GlTabsWrapper 
  :autoFlexTabs="true" 
  tabsWrapperClass="mb-4"
  @TabChange="onTabChange"
  ref="tabsRef"
>
  <GlTab title="General" icon="fas fa-cog">
    <p>General settings content</p>
  </GlTab>
  <GlTab title="Security">
    <p>Security settings content</p>
  </GlTab>
  <GlTab title="Notifications">
    <p>Notification settings content</p>
  </GlTab>
</GlTabsWrapper>
```

**GlTabsWrapper Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFlexTabs` | Boolean | `true` | Auto-flex tab widths |
| `tabsWrapperClass` | String | `""` | Container CSS classes |

**GlTab Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | String | required | Tab title (also used for URL hash) |
| `icon` | String | `""` | Font Awesome icon class |

**Events:**
- `TabChange` - Emitted with tab title when changed

**Methods (via ref):**
- `setActiveTab(title)` - Programmatically switch tabs

**Note:** Tabs sync with URL hash for deep linking.

---

#### GlAccordionsWrapper & GlAccordion
Accordion/collapsible sections (only one open at a time).

```vue
<GlAccordionsWrapper>
  <GlAccordion title="Section 1">
    <p>Content for section 1</p>
  </GlAccordion>
  <GlAccordion title="Section 2">
    <p>Content for section 2</p>
  </GlAccordion>
  <GlAccordion title="Section 3">
    <p>Content for section 3</p>
  </GlAccordion>
</GlAccordionsWrapper>
```

**GlAccordion Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | String | required | Accordion header title |

---

### Toast Notifications

#### GlToastList
Toast notification container. Place once in your app layout.

```vue
<!-- In your App.vue or layout -->
<template>
  <div>
    <GlToastList />
    <router-view />
  </div>
</template>
```

#### Using Toast Notifications
```javascript
import { GlToast } from 'golden-logic-ui'

// Success toast
GlToast.methods.add({
  message: 'AI Task executed successfully',
  type: 'success',
  duration: 5000
})

// Error toast
GlToast.methods.add({
  message: 'An error occurred',
  type: 'error',
  duration: 5000
})

// Warning toast
GlToast.methods.add({
  message: 'Please review your input',
  type: 'warning',
  duration: 4000
})

// Info toast
GlToast.methods.add({
  message: 'New update available',
  type: 'info',
  duration: 3000
})
```

**Toast Types:** `success`, `error`, `warning`, `info`

---

### DataTable Components

#### GlDataTableServerSide / gl-data-table-server-side
Server-side paginated data table with search, sorting, filtering, print, and Excel export.

```vue
<gl-data-table-server-side
  ref="glDataTableRef"
  :columns="columns"
  :xprops="xprops"
  :language="language"
  :enable_select_deselect_delete="true"
  @editAction="editItem"
  @deleteAction="refreshTable"
  @generalAction="handleGeneralAction"
/>
```

**Column Definition:**
```javascript
import { markRaw } from 'vue'
import DatatableAction from 'golden-logic-ui/components/DataTable/DatatableAction.vue'
import DatatableStatus from 'golden-logic-ui/components/DataTable/DatatableStatus.vue'
import DatatableDate from 'golden-logic-ui/components/DataTable/DatatableDate.vue'

const columns = [
  { 
    field_name: 'id', 
    field_label: 'ID', 
    sortable: true 
  },
  { 
    field_name: 'name', 
    field_label: 'Name', 
    sortable: true 
  },
  { 
    field_name: 'type', 
    field_label: 'Type', 
    sortable: true 
  },
  { 
    field_name: 'is_active', 
    field_label: 'Status', 
    sortable: false,
    tdComp: markRaw(DatatableStatus)  // Use markRaw() for component
  },
  { 
    field_name: 'created_at', 
    field_label: 'Created', 
    sortable: true,
    tdComp: markRaw(DatatableDate)
  },
  {
    field_name: 'runs_count',
    field_label: 'Runs',
    sortable: false
  },
  {
    field_name: 'category_id',
    field_label: 'Category',
    sortable: false,
    hasOwnFilter: {
      type: 'dropdown',  // 'dropdown', 'text', 'date'
      options: categoryOptions
    }
  },
  { 
    field_name: 'action', 
    field_label: 'Actions',
    tdComp: markRaw(DatatableAction)
  }
]
```

**xprops Configuration:**
```javascript
const xprops = {
  route: '/admin/AiTasks',              // Base route for edit/delete links
  route_get_data: '/admin/AiTasks/GetAiTasks',  // API endpoint for fetching data
  permission: 'ai_tasks',               // Permission name for edit/delete checks
  defaultSortField: 'created_at',
  customFilters: [
    {
      type: 'dropdown',
      field_name: 'status',
      field_label: 'Status',
      options: [
        { id: 1, name: 'Active' },
        { id: 0, name: 'Inactive' }
      ]
    },
    {
      type: 'date_range',
      field_name: 'date_range',
      field_label: 'Date Range'
    }
  ],
  customFiltersMainClass: 'grid-cols-3'
}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | Array | `[]` | Column definitions |
| `xprops` | Object | `{}` | Configuration object |
| `language` | Object | `{}` | Custom labels |
| `enable_select_deselect_delete` | Boolean | `true` | Show bulk selection/delete |

**Events:**
| Event | Description |
|-------|-------------|
| `editAction` | Emitted when edit action clicked (receives row data) |
| `deleteAction` | Emitted after delete action completed |
| `generalAction` | Emitted for custom actions |

**Methods (via ref):**
| Method | Description |
|--------|-------------|
| `refreshTable()` | Refresh table data |
| `setDynamicQueryString(obj)` | Add custom query parameters |

**Language Object:**
```javascript
const language = {
  show: 'Show',
  entries: 'Entries',
  search: 'Search',
  print: 'Print',
  excel: 'Excel',
  select_all: 'Select all',
  deselect_all: 'Deselect all',
  delete_selected: 'Delete selected',
  please_select_an_option: 'Please select an option'
}
```

**Complete Example:**
```vue
<script setup>
import { ref, markRaw } from 'vue'
import DatatableAction from 'golden-logic-ui/components/DataTable/DatatableAction.vue'

const glDataTableRef = ref(null)

const columns = [
  { field_name: 'id', field_label: 'ID', sortable: true },
  { field_name: 'name', field_label: 'Name', sortable: true },
  { field_name: 'type', field_label: 'Type', sortable: true },
  { field_name: 'trigger', field_label: 'Trigger', sortable: true },
  { field_name: 'runs_count', field_label: 'Runs', sortable: false },
  { field_name: 'action', field_label: 'Actions', tdComp: markRaw(DatatableAction) }
]

const xprops = {
  route: '/admin/AiTasks',
  route_get_data: '/admin/AiTasks/GetAiTasks',
  permission: 'ai_tasks'
}

const editItem = (row) => {
  // Handle edit - row contains full row data
  form.name = row.name
  form.type = row.type
  isOpenUpdate.value = true
}

const refreshTable = () => {
  glDataTableRef.value?.refreshTable()
}

const handleGeneralAction = (action, row) => {
  // Handle custom actions
  console.log(action, row)
}
</script>

<template>
  <Card>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-300">AI Tasks</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage AI-powered tasks</p>
        </div>
        <gl-button @click="isOpen = true" button_type="primary" icon="fa-solid fa-plus">
          Add Task
        </gl-button>
      </div>
    </template>

    <template #body>
      <gl-data-table-server-side
        ref="glDataTableRef"
        :columns="columns"
        :xprops="xprops"
        @editAction="editItem"
        @deleteAction="refreshTable"
        @generalAction="handleGeneralAction"
      />
    </template>
  </Card>
</template>
```

---

#### Built-in DataTable Cell Components

These components are used in column definitions with the `component` property:

#### DatatableStatus
Display active/inactive status badge.

```vue
<DatatableStatus :field="'is_active'" :row="row" />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `field` | String | Field name in row object |
| `row` | Object | Row data object |

**Output:** Green "Active" badge if value is 1, Red "Inactive" badge otherwise.

---

#### DatatableDate
Format and display date values.

```vue
<DatatableDate :field="'created_at'" :row="row" />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `field` | String | Date field name |
| `row` | Object | Row data |

**Output:** Formatted date like "January 13, 2026"

---

#### DatatableFiles
Display file download links.

```vue
<DatatableFiles :field="'attachments'" :row="row" />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `field` | String | Files field name |
| `row` | Object | Row data (field should be array of `{ id, url, name }` or single object) |

---

#### DatatableAction
Edit/Delete action dropdown for table rows.

```vue
<DatatableAction 
  :row="row" 
  :xprops="{ 
    permission: 'users', 
    route: '/admin/users' 
  }" 
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `row` | Object | Row data (must have `id`) |
| `xprops.permission` | String | Permission name for `can()` check |
| `xprops.route` | String | Base route for edit link |

**Required:** Global `can()` function for permission checking.

---

#### DatatableDeleteAction
Delete-only action for table rows.

```vue
<DatatableDeleteAction 
  :row="row" 
  :xprops="{ permission: 'users' }" 
/>
```

---

## Common Patterns

### Form with Validation (Using Form Class)
```vue
<script setup>
import { ref } from 'vue'
import Form from 'golden-logic-ui/Form'
import { GlToast } from 'golden-logic-ui'

const form = new Form({
  name: '',
  email: '',
  category_id: null,
  is_active: 1
})

const isLoading = ref(false)

const submitForm = async () => {
  isLoading.value = true
  
  try {
    await form.post('/api/items')
    GlToast.methods.add({ message: 'Saved successfully!', type: 'success', duration: 5000 })
  } catch (e) {
    // Errors are automatically recorded by Form class
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <text-input
      v-model="form.name"
      field_name="name"
      label_name="Name"
      :is_required="true"
      :show="false"
      :error_message="form.errors.get('name')"
      @keydown="form.errors.clear('name')"
    />
    
    <text-input
      v-model="form.email"
      field_name="email"
      label_name="Email"
      type="email"
      :is_required="true"
      :show="false"
      :error_message="form.errors.get('email')"
      @keydown="form.errors.clear('email')"
    />
    
    <gl-dropdown
      v-model="form.category_id"
      field_name="category_id"
      label_name="Category"
      :options="categories"
      :show="false"
      :error_message="form.errors.get('category_id')"
    />
    
    <gl-toggle-box
      v-model="form.is_active"
      field_name="is_active"
      label_name="Active"
      :show="false"
    />
    
    <gl-button button_type="primary" :is_submit="true" :is_loading="isLoading">
      Save
    </gl-button>
  </form>
</template>
```

### Modal with Form
```vue
<script setup>
import { ref } from 'vue'
import Form from 'golden-logic-ui/Form'

const isOpenUpdate = ref(false)
const isLoading = ref(false)
const form = new Form({ 
  name: '',
  type: null,
  ai_provider_id: null,
  prompt_template: ''
})

const taskTypeOptions = [
  { id: 'analysis', name: 'Analysis' },
  { id: 'generation', name: 'Generation' }
]

const aiProviderOptions = ref([])

const openModal = (item) => {
  form.name = item.name
  form.type = item.type
  form.ai_provider_id = item.ai_provider_id
  form.prompt_template = item.prompt_template
  form.errors.clear()
  isOpenUpdate.value = true
}

const updateItem = async () => {
  isLoading.value = true
  try {
    await form.put(`/api/items/${itemId}`)
    isOpenUpdate.value = false
  } catch (e) {
    // Errors handled by Form class
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <modal 
    :is_open="isOpenUpdate" 
    @closeModal="isOpenUpdate = false" 
    title="Update Item"
    max_width="max-w-2xl"
  >
    <template v-slot:body>
      <div class="mb-4">
        <dropdown 
          v-model="form.type"
          :options="taskTypeOptions" 
          :is_required="true"
          :show="false"
          field_name="type" 
          label_name="Type" 
          placeholder="Select type"
          :error_message="form.errors.get('type')"
          @selectionChanged="form.errors.clear('type')"
        />
      </div>

      <div class="mb-4">
        <text-input 
          v-model="form.name"
          type="text" 
          :is_required="true" 
          :show="false"
          field_name="name" 
          label_name="Name"
          :error_message="form.errors.get('name')"
          @keydown="form.errors.clear('name')"
        />
      </div>

      <div class="mb-4">
        <dropdown 
          v-model="form.ai_provider_id"
          :options="aiProviderOptions" 
          :is_required="true"
          :show="false"
          field_name="ai_provider_id" 
          label_name="AI Provider" 
          placeholder="Select AI Provider"
          option-label="name"
          option-value="id"
          :error_message="form.errors.get('ai_provider_id')"
          @selectionChanged="form.errors.clear('ai_provider_id')"
        />
      </div>

      <div class="mb-4">
        <gl-textarea
          v-model="form.prompt_template"
          :is_required="true"
          :show="false"
          field_name="prompt_template"
          label_name="Prompt Template"
          placeholder="Enter your prompt template"
          :error_message="form.errors.get('prompt_template')"
          @keydown="form.errors.clear('prompt_template')"
        />
      </div>
    </template>

    <template v-slot:buttons>
      <gl-button 
        @click="updateItem()" 
        tag="button" 
        button_type="primary" 
        icon="fa-solid fa-save"
        :is_loading="isLoading"
      >
        Update
      </gl-button>
    </template>
  </modal>
</template>
```

### Delete Confirmation Pattern
```vue
<script setup>
import { ref } from 'vue'
import { GlToast } from 'golden-logic-ui'

const open_delete_modal = ref(false)
const itemToDelete = ref(null)

const openDeleteModal = (item) => {
  itemToDelete.value = item
  open_delete_modal.value = true
}

const deleteAction = async () => {
  await axios.delete(`/api/items/${itemToDelete.value.id}`)
  open_delete_modal.value = false
  GlToast.methods.add({ message: 'Deleted successfully!', type: 'success', duration: 5000 })
}

const closeDeleteModal = () => {
  open_delete_modal.value = false
}
</script>

<template>
  <gl-button button_type="red" @click="openDeleteModal(item)">Delete</gl-button>
  
  <GlDeleteConfirmationModal
    :isOpen="open_delete_modal"
    @confirm-delete="deleteAction"
    @cancel-delete="closeDeleteModal"
  />
</template>
```

---

## CSS Classes Reference

The library uses these custom CSS classes (defined via Tailwind):

- `gl-label-form` - Standard label styling
- `gl-label-form-invalid` - Red label for errors
- `gl-input-form` - Standard input styling
- `gl-input-form-invalid` - Red border input for errors
- `gl-textarea-form` - Standard textarea styling
- `gl-textarea-form-invalid` - Red border textarea for errors
- `gl-span-form-error` - Error message text styling
- `gl-btn-primary` - Primary button color
- `required` - Adds asterisk (*) indicator

---

## Dark Mode Support

All components automatically support dark mode via Tailwind's `dark:` prefix. Ensure your app has dark mode configured in Tailwind CSS.

---

## RTL Support

Components support RTL layouts using Tailwind's `rtl:` and `ltr:` prefixes.

---

## Best Practices

1. **Always provide `field_name`** - Used for form serialization and accessibility
2. **Use `error_message` for validation** - Components automatically style errors
3. **Prefer v-model binding** - All form components support v-model
4. **Use `show` prop for read-only views** - Displays values without inputs
5. **Place `GlToastList` once** - In your root layout component
6. **Use semantic button types** - Match button_type to action (red for delete, green for success)
