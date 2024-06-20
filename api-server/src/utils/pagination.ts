export function getPaginationParams({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}
