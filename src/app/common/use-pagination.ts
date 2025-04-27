import { computed, signal } from "@angular/core";

export function usePagination() {
  const _pageNumber = signal<number>(0);
  const pageNumber = computed(() => _pageNumber());

  function setPageNumber(page: number) {
    _pageNumber.set(page);
  }

  return {
    pageNumber,
    setPageNumber,
  }
}