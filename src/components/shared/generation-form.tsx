"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "sonner";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { useTranslations } from "next-intl";
import { generationStoreAtom } from "@/stores/slices/generation_store";
interface GenerationFormProps {
  textPromptFn: (text: string) => string;
  imagePromptFn: () => string;
  textPlaceholder: string;
  examples: Array<{ id: string | number; url: string }>;
  type?: string;
  defaultValues?: {
    text: string;
    image?: string;
  };
  imgDescription?: string;
}

export default function GenerationForm({
  textPromptFn,
  imagePromptFn,
  textPlaceholder,
  examples,
  type,
  defaultValues,
  imgDescription,
}: GenerationFormProps) {
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "upload">("text");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isGenerating, generateWithImage } = useImageGeneration();
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const t = useTranslations();

  const handleGenerate = async () => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return;
    }

    if (activeTab === "text") {
      const text = inputRef.current?.value;
      const newText = text || defaultValues?.text.replace("e.g.", "");

      try {
        await generateWithImage({
          rawPrompt: newText,
          prompt: textPromptFn(newText || ""),
          shouldUseImageInput: false,
          type,
        });
      } catch (error) {
      } finally {
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: Math.max(prev.generationCount - 1, 0),
        }));
      }
    }

    if (activeTab === "upload") {
      if (!imageForm) {
        toast.error(t("generation-form.image_warning"));
        return;
      }
      try {
        await generateWithImage({
          rawPrompt: "",
          prompt: imagePromptFn(),
          imageData: imageForm,
          shouldUseImageInput: true,
          type,
        });
      } catch (error) {
      } finally {
        setGenerationCount((prev) => ({
          ...prev,
          generationCount: Math.max(prev.generationCount - 1, 0),
        }));
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col">
        <div className="mb-4 flex flex-col md:flex-row">
          <div className="mb-4 w-full md:mb-0 md:mr-4 md:w-3/5">
            {activeTab === "text" ? (
              <Textarea
                id="theme"
                placeholder={textPlaceholder}
                className="h-40 w-full rounded-md border md:h-56"
                ref={inputRef}
              />
            ) : (
              <ImageDrop
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                imageForm={imageForm}
                setImageForm={setImageForm}
                height="224px"
                width="100%"
              />
            )}
          </div>

          <div className="flex w-full flex-col justify-between md:w-2/5">
            <div className="mb-4 flex md:mb-0">
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 rounded-l-md px-2 py-2 text-sm md:flex-none md:px-4 md:text-base ${
                  activeTab === "text"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t("generation-form.text_input")}
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 rounded-r-md px-2 py-2 text-sm md:flex-none md:px-4 md:text-base ${
                  activeTab === "upload"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t("generation-form.upload_input")}
              </button>
            </div>
            {activeTab === "upload" && imgDescription && (
              <div className="mb-4 text-sm">{imgDescription}</div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleGenerate}
                className="w-full rounded-md bg-purple-500 text-white hover:bg-purple-600"
              >
                {t("global.generate_image")}
              </Button>
              <button
                className="flex-shrink-0 text-sm text-purple-500 underline"
                onClick={() =>
                  setExampleStore((prev) => ({
                    ...prev,
                    isModalOpen: true,
                    examples,
                  }))
                }
              >
                {t("global.example")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
