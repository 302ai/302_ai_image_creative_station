import {
  APICallError,
  experimental_generateImage as generateImage,
  generateText,
} from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import { env } from "@/env";
import ky from "ky";
import prompts from "@/constants/prompts";
import { anthropic } from "@ai-sdk/anthropic";

const logger = createScopedLogger("gen-image");

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      isOptimize = false,
      customOptimizePrompt,
      size = "1024x1024",
    }: {
      prompt: string;
      apiKey: string;
      isOptimize?: boolean;
      customOptimizePrompt?: string;
      size?: "1536x1024" | "1024x1024" | "1024x1536";
    } = await request.json();
    const ai302 = createAI302({
      apiKey,
      baseURL: env.NEXT_PUBLIC_API_URL,
    });
    let newPrompt = prompt;
    if (isOptimize) {
      const optimizePrompt = prompts.getOptimizePrompt(customOptimizePrompt);
      console.log("optimizePrompt", optimizePrompt);

      const { text } = await generateText({
        model: ai302.chatModel("claude-3-7-sonnet-20250219"),
        prompt: optimizePrompt.compile({ input: prompt }),
      });
      newPrompt = text;
    }
    console.log("newPrompt", newPrompt);

    const image = await generateImage({
      model: ai302.image("gpt-image-1"),
      prompt: newPrompt,
      size,
    });

    logger.info("Image generated successfully");
    return Response.json({
      image,
    });
  } catch (error) {
    // logger.error(error);
    if (error instanceof APICallError) {
      // console.log("APICallError", error);

      const resp = error.responseBody;

      return Response.json(resp, { status: 500 });
    }
    // Handle different types of errors
    const errorMessage = "Failed to generate image";
    const errorCode = 500;

    if (error instanceof Error) {
      console.log("error", error);

      const resp = (error as any)?.responseBody as any; // You can add specific error code mapping here if needed
      return Response.json(resp, { status: 500 });
    }

    return Response.json(
      {
        error: {
          err_code: errorCode,
          message: errorMessage,
          message_cn: "生成图片失败",
          message_en: "Failed to generate image",
          message_ja: "画像の生成に失敗しました",
          type: "IMAGE_GENERATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
