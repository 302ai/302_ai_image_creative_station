"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { pillCapsulePrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function PillCapsuleForm() {
  const [food, setFood] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!food) {
    //   toast.error(t("pill-capsule.warning.food"));
    //   return;
    // }
    const defaultValues = {
      food: t("pill-capsule.defaultValue"),
    };
    await generateImg({
      rawPrompt: food || defaultValues.food,
      prompt: pillCapsulePrompt(food || defaultValues.food),
      isOptimize: true,
      type: "pill_capsule",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Input
            id="food"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder={t("pill-capsule.placeholder.food")}
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
