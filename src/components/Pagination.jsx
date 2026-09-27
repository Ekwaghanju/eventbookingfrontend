function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Build a compact list of page numbers with ellipses
  const pages = [];
  const push = (n) => pages.push(n);
  const window = 1; // how many neighbours around current page

  push(1);
  if (page - window > 2) push('…');
  for (let i = Math.max(2, page - window); i <= Math.min(totalPages - 1, page + window); i++) {
    push(i);
  }
  if (page + window < totalPages - 1) push('…');
  if (totalPages > 1) push(totalPages);

  return (
    <nav className="pagination" aria-label="Event pages">
      <button
        type="button"
        className="pagination-arrow"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <ul className="pagination-pages">
        {pages.map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} className="pagination-gap" aria-hidden="true">…</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={p === page ? 'pagination-page is-current' : 'pagination-page'}
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="pagination-arrow"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;