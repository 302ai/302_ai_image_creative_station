"use client";
import { Search } from "lucide-react";
import React, { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const GenerationInput = () => {
  const t = useTranslations();
  const [inputValue, setInputValue] = useState("");
  const params = useParams();
  const locale = params.locale as string;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.href = `/${locale}/generation/basic?prompt=${encodeURIComponent(inputValue.trim())}`;
    }
  };

  return (
    <div className="mb-12">
      <form onSubmit={handleSubmit} className="relative mx-auto max-w-xl">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t("home.header.placeholder")}
          className="w-full rounded-full border border-gray-300 px-4 py-3 pr-12"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          disabled={!inputValue.trim()}
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default GenerationInput;
