import { useState } from "react";
import { useAtom } from "jotai";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { appConfigAtom, store } from "@/stores";
import { toast } from "sonner";
import { useHistory } from "@/hooks/db/use-gen-history";
import { generateImage } from "@/services/gen-img";
import { genImgWithImg } from "@/services/gen-img-with-img";
import { useTranslations } from "next-intl";
type ImageGenerationOptions = {
  rawPrompt?: string;
  prompt: string;
  imageData?: string;
  shouldUseImageInput?: boolean;
  type?: string;
};

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const { apiKey } = store.get(appConfigAtom);
  const { addHistory, updateHistory } = useHistory();
  const t = useTranslations();
  const generateWithImage = async (options: ImageGenerationOptions) => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return null;
    }

    setIsGenerating(true);
    setGenerationCount((prev) => ({
      ...prev,
      loading: true,
      generationCount: prev.generationCount + 1,
    }));

    let historyId = "";
    try {
      historyId = await addHistory({
        rawPrompt: options.rawPrompt || "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: options.prompt,
          model: "",
          status: "pending",
          type: options.type,
        },
      });

      if (options.shouldUseImageInput && options.imageData) {
        const { image }: any = await genImgWithImg({
          img: options.imageData,
          prompt: options.prompt,
          apiKey: apiKey || "",
        });

        updateHistory(historyId, {
          rawPrompt: options.rawPrompt || "",
          shouldOptimize: false,
          image: {
            base64: image.url,
            prompt: options.prompt,
            model: "",
            status: "success",
            type: options.type,
          },
        });

        return image;
      } else {
        const { image }: any = await generateImage({
          prompt: options.prompt,
          apiKey: apiKey || "",
        });

        updateHistory(historyId, {
          rawPrompt: options.rawPrompt || "",
          shouldOptimize: false,
          image: {
            base64: "data:image/png;base64," + image.images[0].base64Data,
            prompt: options.prompt,
            model: "",
            status: "success",
            type: options.type,
          },
        });

        return image;
      }
    } catch (error) {
      console.error(error);
      toast.error(t("global.error.generate_failed"));
      updateHistory(historyId, {
        rawPrompt: options.rawPrompt || "",
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "failed",
          type: options.type,
        },
      });
      return null;
    } finally {
      setIsGenerating(false);
      setGenerationCount((prev) => ({
        ...prev,
        generationCount: Math.max(prev.generationCount - 1, 0),
        loading: false,
      }));
    }
  };

  return {
    isGenerating,
    generateWithImage,
  };
}
