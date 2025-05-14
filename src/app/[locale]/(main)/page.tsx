"use client";
import { Search, History as HistoryIcon } from "lucide-react";
import React, { useState } from "react";
import Title from "./components/title";
import GenerationInput from "./components/generation-input";
import History from "./components/history";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import HistoryModal from "@/components/shared/history-modal";

const MainPage = () => {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container relative">
        <div className="text-card-foreground">
          <div className="grid">
            {/* Header Section */}
            <div className="flex w-full items-center justify-between px-4">
              <div className="invisible w-4"></div>
              <div className="flex items-center justify-center">
                <Title />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <HistoryIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <HistoryModal />
                </DialogContent>
              </Dialog>
            </div>

            {/* Input Section */}
            <GenerationInput />
            {/* History Section */}
            <History />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
