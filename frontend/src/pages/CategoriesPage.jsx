import { useEffect, useState } from 'react';
import { Spinner } from '../components/common/Spinner.jsx';
import { CategoryForm } from '../components/forms/CategoryForm.jsx';
import { CategoryList } from '../components/categories/CategoryList.jsx';
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest
} from '../services/categoryService.js';
import { getErrorMessage } from '../utils/errors.js';
import { useNotifications } from '../hooks/useNotifications.js';

export const CategoriesPage = () => {
  const { success, error } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pageError, setPageError] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    setPageError('');

    try {
      const response = await getCategoriesRequest();
      setCategories(response || []);
    } catch (err) {
      const message = getErrorMessage(err);
      setPageError(message);
      error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories().catch(() => {});
  }, []);

  const handleSubmit = async (payload) => {
    setSaving(true);

    try {
      if (selectedCategory) {
        await updateCategoryRequest(selectedCategory.id, payload);
        success('Category updated.');
      } else {
        await createCategoryRequest(payload);
        success('Category created.');
      }

      setSelectedCategory(null);
      await loadCategories();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(`Delete "${category.name}"? Tasks in this category will become uncategorized.`);
    if (!confirmed) return;

    try {
      await deleteCategoryRequest(category.id);
      success('Category deleted.');
      await loadCategories();
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      error(getErrorMessage(err));
    }
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="page-hero__eyebrow">Categories</p>
          <h1>Organize tasks with clear categories.</h1>
          <p>Create color-coded groups that make your work easier to scan and manage.</p>
        </div>
      </section>

      {pageError ? <div className="form-message form-message--error">{pageError}</div> : null}

      <CategoryForm
        initialCategory={selectedCategory}
        submitting={saving}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedCategory(null)}
      />

      {loading ? (
        <div className="page-loader">
          <Spinner label="Loading categories" />
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={setSelectedCategory}
          onDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
};
