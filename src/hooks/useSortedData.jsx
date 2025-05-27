// hooks/useSortedData.js
import { useMemo, useState } from "react";

export default function useSortedData(
  data,
  defaultKey = "id",
  defaultOrder = "desc"
) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortOrder, setSortOrder] = useState(defaultOrder);

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [data, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return { sortedPokemons: sortedData, sortKey, sortOrder, handleSort };
}
