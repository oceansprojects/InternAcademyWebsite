type ManagementCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

export default function ManagementCard({
  title,
  description,
  onClick,
}: ManagementCardProps) {
  return (
    <button
      onClick={onClick}
      className="border rounded-xl p-5 hover:bg-gray-50 hover:shadow-md transition text-left"
    >
      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </button>
  );
}