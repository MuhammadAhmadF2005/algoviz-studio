import { supabase } from "@/integrations/supabase/client";

export const sendMessageToAI = async (message: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('dsa-chat', {
      body: { message }
    });

    if (error) {
      console.error("Edge function error:", error);
      throw error;
    }

    if (data?.error) {
      return data.error;
    }

    return data?.response || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
