import { MediaItemProps } from "./gallery";
import { Image } from "@/components/ui/image";
import { IconButton } from "@/components/ui/icon-button";
import { Tag } from "@/components/ui/tag";
import { useTranslations } from "next-intl";

export const MediaItem = ({
  item,
  className = "",
  onClick,
  onDelete,
  onDownload,
  showActions = true,
  showTag = true,
}: MediaItemProps) => {
  const t = useTranslations();
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(item);
  };

  const getImagePlaceholder = () => {
    return "";
  };

  return (
    <div className={`group relative ${className}`}>
      <div className="relative" style={{ aspectRatio: "1 / 1" }}>
        {showTag && item.tag && (
          <div className="absolute left-3 top-3 z-10">
            <Tag>{item.tag}</Tag>
          </div>
        )}

        {item.status === "pending" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
            <span className="absolute font-medium text-white">
              {t("global.error.generating")}
            </span>
          </div>
        )}

        {item.status === "failed" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span className="mt-2 font-medium text-white">
                {t("global.error.generate_failed")}
              </span>
            </div>
          </div>
        )}

        {showActions && (
          <div className="absolute bottom-3 right-3 z-[60] flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <IconButton onClick={handleDownload} title="Download">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </IconButton>
            <IconButton onClick={handleDelete} title="Delete">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </IconButton>
          </div>
        )}

        {(item.status === "pending" || item.status === "failed") && (
          <div
            className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
            style={{ zIndex: 1 }}
          ></div>
        )}

        <Image
          src={item.url}
          base64={
            item.status === "pending" || item.status === "failed"
              ? ""
              : item.base64
          }
          alt={item.title}
          className="h-full w-full cursor-pointer object-cover"
          onClick={onClick}
        />
      </div>
    </div>
  );
};
