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
import { isometricScenePrompt } from "./prompt";
import { useTranslations } from "next-intl";
export default function IsometricSceneForm() {
  const [scene, setScene] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();
  const handleGenerate = async () => {
    // if (!scene) {
    //   toast.error(t("isometric-scene.warning.scene"));
    //   return;
    // }
    const defaultValues = {
      scene: t("isometric-scene.defaultValue"),
    };

    await generateImg({
      rawPrompt: scene || defaultValues.scene,
      prompt: isometricScenePrompt(scene || defaultValues.scene),
      isOptimize: true,
      type: "isometric_scene",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Input
            id="scene"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            placeholder={t("isometric-scene.placeholder.scene")}
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
