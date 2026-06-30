import { useEffect, useState } from 'react';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';

const emptyCategory = {
  name: '',
  color: '#6366f1'
};

export const CategoryForm = ({ initialCategory, submitting, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState(emptyCategory);
  const isEditing = Boolean(initialCategory?.id);

  useEffect(() => {
    if (initialCategory) {
      setFormState({
        name: initialCategory.name || '',
        color: initialCategory.color || '#6366f1'
      });
      return;
    }

    setFormState(emptyCategory);
  }, [initialCategory]);

  const handleChange = (field) => (event) => {
    setFormState((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-card__header">
        <div>
          <h2>{isEditing ? 'Edit category' : 'Create category'}</h2>
          <p>Group related tasks with a clear visual label.</p>
        </div>
        {isEditing ? (
          <Button variant="secondary" size="sm" onClick={onCancel} type="button">
            Cancel edit
          </Button>
        ) : null}
      </div>

      <div className="form-grid form-grid--category">
        <Input
          label="Category name"
          value={formState.name}
          onChange={handleChange('name')}
          placeholder="For example, Study"
          required
        />
        <Input
          label="Color"
          type="color"
          value={formState.color}
          onChange={handleChange('color')}
        />
      </div>

      <div className="form-card__actions">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEditing ? 'Update category' : 'Create category'}
        </Button>
      </div>
    </form>
  );
};

