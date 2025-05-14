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
import { tweetPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function TweetForm() {
  const [text, setText] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!text) {
    //   toast.error(t("tweet.warning.text"));
    //   return;
    // }
    const defaultValues = {
      text: t("tweet.defaultValue"),
    };
    await generateImg({
      rawPrompt: text || defaultValues.text,
      prompt: tweetPrompt(text || defaultValues.text),
      isOptimize: true,
      customOptimizePrompt: tweetPrompt(text || defaultValues.text),
      size: "1024x1536",
      type: "tweet",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Label htmlFor="text" className="flex-shrink-0 pt-2">
            {t("tweet.label.text")}
          </Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("tweet.placeholder.text")}
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
