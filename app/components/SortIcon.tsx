import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

type Props = {
  field: string;
  sortField: string | null;
  sortOrder: "asc" | "desc" | null;
};

export default function SortIcon({ field, sortField, sortOrder }: Props) {
  if (sortField !== field)
    return <FaSort className="text-(--muted) opacity-50" size={11} />;
  return sortOrder === "asc" ? (
    <FaSortUp className="text-(--primary)" size={11} />
  ) : (
    <FaSortDown className="text-(--primary)" size={11} />
  );
}
