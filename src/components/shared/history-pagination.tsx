"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Trophy,
  Download,
  ImageOff,
} from "lucide-react";
import Image from "next/image";
import { GalleryModal } from "@/components/ui/gallery/gallery-modal";
import { useState, useMemo } from "react";
import type { MediaItemType } from "@/components/ui/gallery/gallery";
import type { History as HistoryType } from "@/db/types";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useHomeHistory } from "@/hooks/db/use-home-history";
import { store } from "@/stores";
import { appConfigAtom } from "@/stores";

interface GalleryItem extends MediaItemType {
  id: string;
  url: string;
  base64: string;
  title: string;
  desc: string;
  tag?: string;
}

export default function History() {
  const t = useTranslations("history");
  const sidebarT = useTranslations("sidebar");
  const commonT = useTranslations("common");
  const [page, setPage] = useState(1);
  const { history, deleteHistory } = useHomeHistory(page);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleDownload } = useMonitorMessage();
  const { region } = store.get(appConfigAtom);

  // URL replacement function
  const processUrl = (url: string): string => {
    if (
      typeof url === "string" &&
      url.includes("file.302.ai") &&
      region === 0
    ) {
      return url.replace("file.302.ai", "file.302ai.cn");
    }
    return url;
  };

  // 将当前记录的图片转换为GalleryModal需要的格式
  const currentGalleryItems = useMemo(() => {
    if (!selectedItem || !history) return [];

    const record = history.items.find(
      (h) => h.image.base64 === selectedItem.base64
    );

    if (!record) return [];

    const processedBase64 = processUrl(record.image.base64);

    return [
      {
        id: record.id,
        url: "",
        base64: processedBase64,
        desc: record.image.prompt,
        title: record.image.prompt,
      },
    ];
  }, [selectedItem, history, t, region]);

  const handleImageClick = (
    record: HistoryType,
    image: HistoryType["image"]
  ) => {
    const processedBase64 = processUrl(image.base64);

    setSelectedItem({
      id: `${record.id}`,
      url: "",
      base64: processedBase64,
      desc: image.prompt,
      title: image.prompt,
    });
    setIsModalOpen(true);
  };

  if (!history) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (history.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-semibold">
          {t("noHistoryTitle") || "No history found"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("noHistoryMessage") || "Your generated images will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground focus-within:border-transparent focus-within:ring-1 focus-within:ring-violet-500">
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.items.map((record) => (
              <div
                key={record.id}
                className="group relative rounded-lg border bg-background p-4"
              >
                {/* 头部信息 */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(record.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(
                          record.image.base64,
                          `${record.image.prompt.slice(0, 10)}.png`
                        );
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteHistory(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 图片展示 */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <div
                      className="group/image relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-[1.02]"
                      onClick={() => handleImageClick(record, record.image)}
                    >
                      <Image
                        src={processUrl(record.image.base64)}
                        alt={record.image.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="text-center text-sm font-medium">
                      {sidebarT(`${record.image.type}`)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {history.totalPages > 1 && (
            <div className="@lg:pb-3 border-t px-4 py-3 pb-20">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn(
                        page === 1 && "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.previous")}
                    >
                      <span>{commonT("pagination.previous")}</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from(
                    { length: history.totalPages },
                    (_, i) => i + 1
                  ).map((pageNumber) => {
                    // Show first page, current page, last page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === history.totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Show ellipsis for gaps
                    if (
                      pageNumber === 2 ||
                      pageNumber === history.totalPages - 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis>
                            <span className="sr-only">
                              {commonT("pagination.more_pages")}
                            </span>
                          </PaginationEllipsis>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(history.totalPages, p + 1))
                      }
                      className={cn(
                        page === history.totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.next")}
                    >
                      <span>{commonT("pagination.next")}</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* 图片预览弹窗 */}
      {selectedItem && (
        <GalleryModal
          showContent={false}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedItem={selectedItem}
          setSelectedItem={(item) => setSelectedItem(item as GalleryItem)}
          mediaItems={currentGalleryItems}
          showDelete={false}
          onDownload={(item) => {
            if (item.base64) {
              const processedBase64 = processUrl(item.base64);
              handleDownload(processedBase64, `${item.desc.slice(0, 10)}.png`);
            }
          }}
        />
      )}
    </div>
  );
}
