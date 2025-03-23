import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export const generateResult = async (prompt) => {  // jaise hi tum genateResult ko call karoge with some prompt to ye model us prompt ke basis pe kaam karega aur uske basis pe result generate karke dedega
    // const prompt = "Explain how AI works";
    const result = await model.generateContent(prompt);
    return result.response.text() ;
}


