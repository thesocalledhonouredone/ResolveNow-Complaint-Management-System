// Pagination utility
export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Get pagination metadata
export const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// Build pagination response
export const buildPaginatedResponse = (data, total, page, limit, message = 'Success') => {
  const pagination = getPaginationMeta(total, page, limit);
  
  return {
    success: true,
    message,
    data,
    pagination
  };
};