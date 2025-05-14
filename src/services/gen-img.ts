import ky, { HTTPError } from "ky";
import { emitter } from "@/utils/mitt";
import { store, languageAtom } from "@/stores";
import { langToCountry } from "@/utils/302";

interface GenerateImageParams {
  prompt: string;
  apiKey: string;
  isOptimize?: boolean;
  customOptimizePrompt?: string;
  size?: "1536x1024" | "1024x1024" | "1024x1536";
}

interface GenerateImageResult {
  image: {
    image: string;
    prompt: string;
  };
}

export const generateImage = async ({
  prompt,
  apiKey,
  isOptimize = false,
  customOptimizePrompt,
  size,
}: GenerateImageParams) => {
  try {
    const res = await ky.post("/api/gen-img", {
      timeout: 300000,
      json: {
        prompt,
        apiKey,
        isOptimize,
        customOptimizePrompt,
        size,
      },
    });
    return res.json<GenerateImageResult>();
  } catch (error) {
    if (error instanceof Error) {
      const uiLanguage = store.get(languageAtom);

      if (error instanceof HTTPError) {
        try {
          const errorData = JSON.parse((await error.response.json()) as string);
          if (errorData.error && uiLanguage) {
            const countryCode = langToCountry(uiLanguage);
            const messageKey =
              countryCode === "en" ? "message" : `message_${countryCode}`;
            const message = errorData.error[messageKey];
            emitter.emit("ToastError", {
              code: errorData.error.err_code,
              message,
            });
          }
        } catch {
          // If we can't parse the error response, show a generic error
          emitter.emit("ToastError", {
            code: error.response.status,
            message: error.message,
          });
        }
      } else {
        // For non-HTTP errors
        emitter.emit("ToastError", {
          code: 500,
          message: error.message,
        });
      }
    }
    throw error; // Re-throw the error for the caller to handle if needed
  }
};
