interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
}

interface ProcessedPaginationParams {
  skip: number;
  limit: number;
  sort: string;
}

export const processPaginationParams = (
  query: PaginationParams,
): ProcessedPaginationParams => {
  const { page = 1, limit = 10, sort = 'desc' } = query;
  const parsedLimit = limit > 15 || limit < 0 ? 15 : limit;
  const skip = (page - 1) * parsedLimit;

  return { skip, limit: parsedLimit, sort: sort.toString() };
};
