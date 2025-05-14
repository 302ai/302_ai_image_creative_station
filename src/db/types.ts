export type History = {
  id: string;
  rawPrompt: string;
  shouldOptimize: boolean;
  image: {
    base64: string;
    prompt: string;
    model: string;
    status: "pending" | "success" | "failed";
    size?: "1536x1024" | "1024x1024" | "1024x1536";
    type?: string;
  };

  createdAt: number;
};

export type AddHistory = Omit<History, "id" | "createdAt">;
