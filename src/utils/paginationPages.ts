export const generatePagination = (
  currentPage: number,
  totalPages: number
) => {

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1
    )
  }

  const startPages = [1, 2, 3]
  const endPages = [
    totalPages - 2,
    totalPages - 1,
    totalPages,
  ]

  // dekat awal
  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      '...',
      ...endPages,
    ]
  }

  // dekat akhir
  if (currentPage >= totalPages - 3) {
    return [
      ...startPages,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  // tengah
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}