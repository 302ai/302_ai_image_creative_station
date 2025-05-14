import React from "react";
import ImageDesc from "./image-desc";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/db/use-gen-history";
import { useAtom } from "jotai";
import { actionReferenceImagesStoreAtom } from "@/stores/slices/action_reference_images_store";
import { logger } from "@/utils";
import { generateStyleImage } from "@/services/gen-style";
import { appConfigAtom } from "@/stores/slices/config_store";
import { store } from "@/stores";
import { createScopedLogger } from "@/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { generationStoreAtom } from "@/stores/slices/generation_store";

const ChangeImage = () => {
  const { addHistory, updateHistory } = useHistory();
  const [actionReferenceImage, setActionReferenceImage] = useAtom(
    actionReferenceImagesStoreAtom
  );
  const { apiKey } = store.get(appConfigAtom);
  const t = useTranslations();
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const handleGenerateImage = async () => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return;
    }

    if (!actionReferenceImage.actionImage) {
      toast.error(t("basic.warning.actionImage"));
      return;
    }
    if (!actionReferenceImage.referenceImage) {
      toast.error(t("basic.warning.referenceImage"));
      return;
    }
    let historyId = "";
    try {
      historyId = await addHistory({
        rawPrompt: "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "pending",
          type: "realistic_photo",
        },
      });
      const { image } = await generateStyleImage({
        apiKey: apiKey || "",
        originImage: actionReferenceImage.actionImage,
        referenceImage: actionReferenceImage.referenceImage,
      });

      updateHistory(historyId, {
        rawPrompt: "",
        shouldOptimize: false,
        image: {
          base64: image.url,
          prompt: "",
          model: "gpt-image-1",
          status: "success",
          type: "realistic_photo",
        },
      });
    } catch (error) {
      logger.error(`generateImage error: `, error);

      updateHistory(historyId, {
        rawPrompt: "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "failed",
          type: "realistic_photo",
        },
      });
    } finally {
      setGenerationCount((prev) => ({
        ...prev,
        generationCount: Math.max(prev.generationCount - 1, 0),
      }));
    }
  };
  return (
    <div className="space-y-4">
      <ImageDesc />
      <div className="flex justify-end">
        <Button onClick={handleGenerateImage}>生成</Button>
      </div>
    </div>
  );
};

export default ChangeImage;
