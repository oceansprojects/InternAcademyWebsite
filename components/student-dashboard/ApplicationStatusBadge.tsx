interface Props {
  status: string;
}

export default function ApplicationStatusBadge({
  status,
}: Props) {
  switch (status) {
    case "pending":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
          Pending Review
        </span>
      );

    case "active":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          Accepted
        </span>
      );

    case "completed":
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          Completed
        </span>
      );

    case "dropped":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          Closed
        </span>
      );

    default:
      return (
        <span className="rounded-full border px-3 py-1 text-sm">
          {status}
        </span>
      );
  }
}