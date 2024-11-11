export const PAGE_SIZE = 15;

export const getPaginationOpts = (
  page: number | undefined,
  limit: number = PAGE_SIZE,
  pagination: boolean = true
) => {
  if (!pagination) {
    return {};
  }

  const offset = page ? limit * (page - 1) : 0;

  return { limit: limit, offset };
};

export const paginatedResponse = <T>(
  record: T,
  currentPage: number,
  count: number,
  pageSize?: number
) => {
  return {
    data: record,
    page: {
      pageSize: pageSize || PAGE_SIZE,
      currentPage: currentPage ? Math.max(currentPage, 1) : 1,
      count,
    },
  };
};
