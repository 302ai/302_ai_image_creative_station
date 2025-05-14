"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState } from "react";
import { examples } from "./examples";
import { generateEnglishCard } from "@/services/gen-english-card";
import { appConfigAtom } from "@/stores/slices/config_store";
import { generationStoreAtom } from "@/stores/slices/generation_store";
import { store } from "@/stores";
import { useHistory } from "@/hooks/db/use-gen-history";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { useTranslations } from "next-intl";
const EnglishCardsPage = () => {
  const t = useTranslations();
  const [words, setWords] = useState("");
  const { apiKey } = store.get(appConfigAtom);
  const { addHistory, updateHistory } = useHistory();
  const [generationCount, setGenerationCount] = useAtom(generationStoreAtom);
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const onClick = async () => {
    if (generationCount.generationCount >= 4) {
      toast.warning(t("global.error.max_generation"));
      return;
    }

    setGenerationCount((prev) => ({
      ...prev,
      loading: true,
      generationCount: prev.generationCount + 1,
    }));
    let historyId = "";
    try {
      historyId = await addHistory({
        rawPrompt: words,
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "pending",
        },
      });

      const result = await generateEnglishCard({
        words: words || "apple,tree,bear,banana",
        apiKey: apiKey || "",
      });
      updateHistory(historyId, {
        rawPrompt: words,
        shouldOptimize: false,
        image: {
          base64: "data:image/png;base64," + result.image.image,
          prompt: result.image.prompt,
          model: result.image.model,
          status: "success",
          type: "english_cards",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(t("global.error.generate_failed"));
      updateHistory(historyId, {
        rawPrompt: words,
        shouldOptimize: false,
        image: {
          base64: "",
          prompt: "",
          model: "",
          status: "failed",
          type: "english_cards",
        },
      });
    } finally {
      setGenerationCount((prev) => ({
        ...prev,
        loading: false,
        generationCount: Math.max(prev.generationCount - 1, 0),
      }));
    }
  };
  return (
    <div className="mx-auto w-full max-w-3xl justify-center space-y-4 pt-3">
      <Card className="w-full">
        <Textarea
          placeholder={t("english_cards.input.placeholder")}
          value={words}
          onChange={(e) => setWords(e.target.value)}
          className="h-full w-full resize-none border-none focus-visible:ring-0"
        />
      </Card>

      <div className="flex items-center justify-end gap-4">
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
          onClick={onClick}
          className="t-medium rounded-lg bg-purple-500 text-white transition-colors hover:bg-purple-600"
        >
          {t("global.generate_image")}
        </Button>
      </div>
    </div>
  );
};

export default EnglishCardsPage;
