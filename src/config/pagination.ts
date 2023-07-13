interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
}

interface ProcessedPaginationParams {
  skip: number;
  limit: number;
  sort: string;
}

export const processPaginationParams = (
  query: any,
): ProcessedPaginationParams => {
  const { page = 1, limit = 10, sort = 'desc' } = query;
  const parsedLimit = Math.abs(limit) > 15 ? 15 : Math.abs(limit);
  const skip = (page - 1) * parsedLimit;

  return { skip, limit: parsedLimit, sort: sort.toString() };
};
