import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export const CategoryList = ({ categories, onEdit, onDelete, loading }) => {
  if (!loading && categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Create a category to organize your tasks by topic, course, or priority area."
      />
    );
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <Card key={category.id} className="category-card">
          <div className="category-card__top">
            <div className="category-card__swatch" style={{ backgroundColor: category.color }} />
            <div>
              <h3>{category.name}</h3>
              <p>{category.color}</p>
            </div>
          </div>
          <div className="category-card__actions">
            <Button variant="secondary" size="sm" onClick={() => onEdit(category)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(category)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

