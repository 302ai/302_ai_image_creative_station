"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { createScopedLogger } from "@/utils/logger";
import TextToImage from "@/components/basic/text-to-image";
import { Textarea } from "@/components/ui/textarea";
import ChangeStyle from "@/components/basic/change-style";
import { useTranslations } from "next-intl";
const logger = createScopedLogger("Home");

export default function Home() {
  const t = useTranslations();
  return (
    <div className="">
      <Tabs defaultValue="text2img" className="w-full">
        <TabsList className="mb-6 ml-4">
          <TabsTrigger value="text2img">{t("basic.text2img")}</TabsTrigger>
          <TabsTrigger value="styleEdit">{t("basic.styleEdit")}</TabsTrigger>
        </TabsList>

        <div className="flex justify-center">
          <TabsContent value="text2img" className="w-full max-w-3xl">
            <TextToImage />
          </TabsContent>

          <TabsContent value="styleEdit" className="w-full max-w-3xl">
            <ChangeStyle />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
