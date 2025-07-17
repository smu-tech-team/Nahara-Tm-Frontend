const Pagination = ({ page, totalPages, goToPage }) => (
  <div className="mt-10 flex justify-center items-center gap-3">
    <button
      onClick={() => goToPage(page - 1)}
      disabled={page === 0}
      className="px-4 py-2 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-sm">Page {page + 1} of {totalPages}</span>
    <button
      onClick={() => goToPage(page + 1)}
      disabled={page + 1 >= totalPages}
      className="px-4 py-2 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-lg disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default Pagination;
