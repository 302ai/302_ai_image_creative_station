"use client";

import GenerationForm from "@/components/shared/generation-form";
import { examples } from "./examples";
import { textPrompt, uploadImagePrompt } from "./prompt";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import ImageDrop from "@/components/basic/change-style/text/image-drop";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function StickerDesignForm() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"text" | "upload">("text");
  const [style, setStyle] = useState<"illustration" | "anime">("illustration");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isGenerating, generateWithImage } = useImageGeneration();
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageForm, setImageForm] = useState("");

  const handleGenerate = async () => {
    if (activeTab === "text") {
      const text = inputRef.current?.value;
      // if (!text) {
      //   toast.error(t("sticker-design.warning.text"));
      //   return;
      // }
      const defaultValues = {
        text: t("sticker-design.defaultValue.text"),
      };
      await generateWithImage({
        rawPrompt: text || defaultValues.text,
        prompt: textPrompt(text || defaultValues.text)[style],
        shouldUseImageInput: false,
        type: "sticker_design",
      });
    }

    if (activeTab === "upload") {
      if (!imageForm) {
        toast.error(t("sticker-design.warning.image"));
        return;
      }

      await generateWithImage({
        rawPrompt: "",
        prompt: uploadImagePrompt()[style],
        imageData: imageForm,
        shouldUseImageInput: true,
      });
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
                placeholder={t("sticker-design.placeholder.text")}
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
                {t("sticker-design.label.text_input")}
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 rounded-r-md px-2 py-2 text-sm md:flex-none md:px-4 md:text-base ${
                  activeTab === "upload"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t("sticker-design.label.upload_input")}
              </button>
            </div>

            <div className="mb-4">
              <Select
                value={style}
                onValueChange={(value) =>
                  setStyle(value as "illustration" | "anime")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("sticker-design.label.style")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="illustration">
                    {t("sticker-design.style.illustration")}
                  </SelectItem>
                  <SelectItem value="anime">
                    {t("sticker-design.style.anime")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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
