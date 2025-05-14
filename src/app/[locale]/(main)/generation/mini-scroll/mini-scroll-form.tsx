"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { miniScrollPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function MiniScrollForm() {
  const [text, setText] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!text) {
    //   toast.error(t("mini-scroll.warning.text"));
    //   return;
    // }
    const defaultValues = {
      text: t("mini-scroll.defaultValue.text"),
    };

    await generateImg({
      rawPrompt: text || defaultValues.text,
      prompt: miniScrollPrompt(text || defaultValues.text),
      isOptimize: false,
      size: "1536x1024",
      type: "mini_scroll",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Label htmlFor="text" className="flex-shrink-0 pt-2">
            {t("mini-scroll.label.text")}
          </Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("mini-scroll.placeholder.text")}
          />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            className="text-sm text-purple-500 underline"
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
          <Button
            className="bg-purple-500 hover:bg-purple-600"
            onClick={handleGenerate}
          >
            {t("global.generate_image")}
          </Button>
        </div>
      </div>
    </div>
  );
}
