export default function Pagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPokemons,
}) {
  const lastPage = Math.ceil(totalPokemons / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Add left-side ellipsis if needed
      if (currentPage > 4) {
        pages.push("...");
      }

      // Middle pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add right-side ellipsis if needed
      if (currentPage < lastPage - 3) {
        pages.push("...");
      }

      // Always show last page
      pages.push(lastPage);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="dots">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => goToPage(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#8592;
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        &#8594;
      </button>
    </div>
  );
}
