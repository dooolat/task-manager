import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';
import { Button } from '../common/Button.jsx';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../../constants/task.js';

export const TaskFilters = ({ filters, onChange, onReset }) => (
  <div className="card filters-card">
    <div className="filters-grid">
      <Input
        label="Search"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Search tasks by title"
      />
      <Select label="Status" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
        {TASK_STATUS_OPTIONS.map((option) => (
          <option key={option.value || 'all-statuses'} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select
        label="Priority"
        value={filters.priority}
        onChange={(event) => onChange('priority', event.target.value)}
      >
        {TASK_PRIORITY_OPTIONS.map((option) => (
          <option key={option.value || 'all-priorities'} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select label="Page size" value={filters.limit} onChange={(event) => onChange('limit', Number(event.target.value))}>
        {[5, 10, 20, 50].map((value) => (
          <option key={value} value={value}>
            {value} per page
          </option>
        ))}
      </Select>
    </div>

    <div className="filters-card__actions">
      <Button variant="secondary" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  </div>
);

