"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGenerateImage } from "@/hooks/use-generate-image";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { exampleStoreAtom } from "@/stores/slices/example_store";
import { examples } from "./examples";
import { leftPagePrompt } from "./prompt";
import { rightPagePrompt } from "./prompt";
import { useIsMobile } from "@/hooks/global/use-mobile";
import { useTranslations } from "next-intl";

export default function AncientBookForm() {
  const [style, setStyle] = useState("handdrawn");
  const [exampleStore, setExampleStore] = useAtom(exampleStoreAtom);
  const { isGenerating, generateImg } = useGenerateImage();
  const [leftPage, setLeftPage] = useState<string>("ancient-book");
  const [rightPage, setRightPage] = useState<string>("miniature-scene");
  const [text, setText] = useState<string>("");
  const isMobile = useIsMobile();
  const t = useTranslations();

  // Ensure left and right page selections are not the same
  useEffect(() => {
    if (leftPage === rightPage) {
      if (leftPage === "ancient-book") {
        setRightPage("miniature-scene");
      } else {
        setRightPage("ancient-book");
      }
    }
  }, [leftPage, rightPage]);

  const handleLeftPageChange = (value: string) => {
    setLeftPage(value);
    if (value === rightPage) {
      setRightPage(
        value === "ancient-book" ? "miniature-scene" : "ancient-book"
      );
    }
  };

  const handleRightPageChange = (value: string) => {
    setRightPage(value);
    if (value === leftPage) {
      setLeftPage(
        value === "ancient-book" ? "miniature-scene" : "ancient-book"
      );
    }
  };
  const handleGenerateImage = async () => {
    // if (!leftPage || !rightPage || !text) {
    //   toast.error(t("ancient-book.warning.complete"));
    //   return;
    // }
    const isLeftAncientBook = leftPage === "ancient-book";
    const defaultValues = {
      text: t("ancient-book.defaultValue"),
    };
    const prompt = isLeftAncientBook
      ? leftPagePrompt(text || defaultValues.text)
      : rightPagePrompt(text || defaultValues.text);
    await generateImg({
      rawPrompt: `${text || defaultValues.text}`,
      prompt,
      type: "ancient_book",
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0">
        <div className="flex flex-1 flex-col gap-2">
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("ancient-book.placeholder.scene")}
            className="min-h-[180px] w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex w-full flex-col gap-6 md:w-[300px] md:justify-between md:pl-6">
          {/* Left Page Selection */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <Label
              htmlFor="left-page"
              className="font-medium md:w-16 md:text-right"
            >
              {t("ancient-book.label.leftPage")}
            </Label>
            <RadioGroup
              id="left-page"
              value={leftPage}
              onValueChange={handleLeftPageChange}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ancient-book" id="left-ancient-book" />
                <Label htmlFor="left-ancient-book">
                  {t("ancient-book.type.ancientBook")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="miniature-scene"
                  id="left-miniature-scene"
                />
                <Label htmlFor="left-miniature-scene">
                  {t("ancient-book.type.miniatureScene")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Right Page Selection */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <Label
              htmlFor="right-page"
              className="font-medium md:w-16 md:text-right"
            >
              {t("ancient-book.label.rightPage")}
            </Label>
            <RadioGroup
              id="right-page"
              value={rightPage}
              onValueChange={handleRightPageChange}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ancient-book" id="right-ancient-book" />
                <Label htmlFor="right-ancient-book">
                  {t("ancient-book.type.ancientBook")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="miniature-scene"
                  id="right-miniature-scene"
                />
                <Label htmlFor="right-miniature-scene">
                  {t("ancient-book.type.miniatureScene")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
            <Button
              className="w-full rounded-md bg-purple-500 py-2 text-white hover:bg-purple-600"
              onClick={handleGenerateImage}
            >
              {t("global.generate_image")}
            </Button>
            <button
              className="text-center text-sm text-purple-500 underline lg:flex-shrink-0"
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
  );
}
