import React from "react";
import { useTranslations } from "next-intl";
import HistoryPagination from "./history-pagination";
const HistoryModal = () => {
  const t = useTranslations();
  return (
    <div className="max-h-[70vh] overflow-y-auto pr-2">
      <h2 className="sticky top-0 z-10 mb-4 bg-background py-2 text-xl font-bold">
        {t("gallery.title")}
      </h2>
      <HistoryPagination />
    </div>
  );
};

export default HistoryModal;
