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
import { microWorldPrompt } from "./prompt";
import { useTranslations } from "next-intl";

export default function MicroWorldForm() {
  const [externalWorld, setExternalWorld] = useState("");
  const [internalWorld, setInternalWorld] = useState("");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const t = useTranslations();

  const handleGenerate = async () => {
    // if (!externalWorld) {
    //   toast.error(t("micro-world.warning.externalWorld"));
    //   return;
    // }
    // if (!internalWorld) {
    //   toast.error(t("micro-world.warning.internalWorld"));
    //   return;
    // }
    const defaultValues = {
      externalWorld: t("micro-world.defaultValue.externalWorld"),
      internalWorld: t("micro-world.defaultValue.internalWorld"),
    };

    await generateImg({
      rawPrompt: `${externalWorld || defaultValues.externalWorld},${internalWorld || defaultValues.internalWorld}`,
      prompt: microWorldPrompt(
        externalWorld || defaultValues.externalWorld,
        internalWorld || defaultValues.internalWorld
      ),
      isOptimize: true,
      customOptimizePrompt: microWorldPrompt(
        externalWorld || defaultValues.externalWorld,
        internalWorld || defaultValues.internalWorld
      ),
      type: "micro_world",
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="externalWorld" className="w-20 flex-shrink-0">
            {t("micro-world.label.externalWorld")}
          </Label>
          <Input
            id="externalWorld"
            value={externalWorld}
            onChange={(e) => setExternalWorld(e.target.value)}
            placeholder={t("micro-world.placeholder.externalWorld")}
          />
        </div>

        <div className="flex items-start gap-4">
          <Label htmlFor="internalWorld" className="w-20 flex-shrink-0 pt-2">
            {t("micro-world.label.internalWorld")}
          </Label>
          <Textarea
            id="internalWorld"
            value={internalWorld}
            onChange={(e) => setInternalWorld(e.target.value)}
            placeholder={t("micro-world.placeholder.internalWorld")}
            className="min-h-[100px]"
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
