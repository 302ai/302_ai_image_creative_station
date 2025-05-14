import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useHistory } from "@/hooks/db/use-gen-history";
import { toast } from "sonner";
import { ErrorToast } from "@/components/ui/errorToast";
import { actionReferenceImagesStoreAtom } from "@/stores/slices/action_reference_images_store";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Label } from "recharts";
import ky from "ky";
import { logger } from "@/utils/logger";
import { appConfigAtom, store } from "@/stores";
import { generationStoreAtom } from "@/stores/slices/generation_store";
// 风格示例数据
// All available styles
const allStyles = [
  "anime",
  "watercolor",
  "low_poly",
  "pixel_art",
  "steampunk",
  "cyberpunk",
  "minimalist",
  "retro",
  "graffiti",
  "realistic",
  "impressionism",
  "surrealism",
  "abstract",
  "classical",
  "pop_art",
  "ghibli",
  "sci_fi",
  "illustration",
  "ink_painting",
  "sketch",
  "black_and_white",
  "crayon",
  "disney",
  "3d_animation",
  "dreamy",
];

// Helper function to convert URL to File object
const urlToFile = async (url: string, filename: string): Promise<File> => {
  // Fetch the image
  const response = await fetch(url);
  const blob = await response.blob();

  // Create File object from blob
  return new File([blob], filename, { type: blob.type });
};

const Text = () => {
  const t = useTranslations();
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  const { addHistory, updateHistory } = useHistory();
  const [actionReferenceImages, setActionReferenceImages] = useAtom(
    actionReferenceImagesStoreAtom
  );
  const { apiKey } = store.get(appConfigAtom);
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const onClick = (style: string) => {
    setStyleForm({
      ...styleForm,
      prompt: style,
    });
  };

  const handleGenerateTextToImage = async () => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return;
    }

    if (styleForm.prompt.trim() === "") {
      toast.error(t("basic.input.style_description"));
      return;
    }
    if (actionReferenceImages.actionImage.trim() === "") {
      toast.error(t("global.error.empty_image"));
      return;
    }

    setGenerationCount((prev) => ({
      ...prev,
      loading: true,
      generationCount: prev.generationCount + 1,
    }));
    const formdata = new FormData();
    let imageFile;
    const actionImage = actionReferenceImages.actionImage;
    if (actionImage && actionImage.startsWith("http")) {
      try {
        // Extract filename from URL or use a default name
        const filename = actionImage.split("/").pop() || "image.jpg";
        imageFile = await urlToFile(actionImage, filename);

        formdata.append("image", imageFile);
      } catch (error) {
        logger.error("Failed to convert URL to File:", error);
        throw new Error("Failed to process image URL");
      }
    } else {
      // If it's already a File object or base64 string
      imageFile = actionImage;
      formdata.append("image", imageFile);
    }

    // formdata.append("mask", originImage.image);
    formdata.append("prompt", styleForm.prompt);
    formdata.append("model", "gpt-image-1");
    let historyId = "";
    try {
      historyId = await addHistory({
        rawPrompt: styleForm.prompt,
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "pending",
          type: "realistic_photo",
        },
      });
      const result = await ky
        .post("https://api.302.ai/v1/images/edits", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formdata,
          timeout: 120000,
        })
        .text();
      // Parse the response to get the image URL
      const responseData = JSON.parse(result);

      const data = responseData?.data?.[0];

      updateHistory(historyId, {
        rawPrompt: styleForm.prompt,
        shouldOptimize: false,
        image: {
          base64: data.url,
          prompt: styleForm.prompt,
          model: "gpt-image-1",
          status: "success",
          type: "realistic_photo",
        },
      });
    } catch (error: any) {
      console.log("error", error);
      updateHistory(historyId, {
        rawPrompt: styleForm.prompt,
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "failed",
          type: "realistic_photo",
        },
      });

      // Check if error has response with error code
      if (error.response) {
        try {
          const errorText = await error.response.text();
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.err_code) {
            toast.error(() => ErrorToast(errorData.error.err_code));
            throw error;
          }
        } catch (parseError) {
          // If parsing fails, continue to default error handling
        }
      }

      throw error; // Rethrow to be caught by the outer try-catch
    } finally {
      setGenerationCount((prev) => ({
        ...prev,
        generationCount: Math.max(prev.generationCount - 1, 0),
      }));
    }
  };
  return (
    <div className="space-y-4">
      {/* 文字描述输入框 */}
      <Textarea
        placeholder={t("basic.input.style_description")}
        value={styleForm.prompt}
        onChange={(e) => setStyleForm({ ...styleForm, prompt: e.target.value })}
        className="min-h-[100px] w-full"
      />

      {/* 风格示例 */}
      <div className="space-y-2">
        <Label>{t("basic.style_example")}</Label>
        <div className="grid max-h-[200px] grid-cols-4 gap-2 overflow-y-auto">
          {allStyles.map((style) => (
            <Button
              key={style}
              variant="outline"
              size="sm"
              className={`h-8 text-xs`}
              onClick={() => onClick(t(`styles.${style}`))}
            >
              {t(`styles.${style}`)}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => handleGenerateTextToImage()}>
          {t("global.generate_image")}
        </Button>
      </div>
    </div>
  );
};

export default Text;
