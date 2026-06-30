import { Button } from './Button.jsx';

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const visiblePages = [];
  const startPage = Math.max(1, meta.page - 2);
  const endPage = Math.min(meta.totalPages, startPage + 4);

  for (let page = startPage; page <= endPage; page += 1) {
    visiblePages.push(page);
  }

  return (
    <div className="pagination">
      <Button variant="secondary" size="sm" disabled={!meta.hasPrev} onClick={() => onPageChange(meta.page - 1)}>
        Previous
      </Button>

      <div className="pagination__pages">
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === meta.page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button variant="secondary" size="sm" disabled={!meta.hasNext} onClick={() => onPageChange(meta.page + 1)}>
        Next
      </Button>
    </div>
  );
};

