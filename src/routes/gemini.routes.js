import {Router} from 'express';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import {GoogleGenerativeAI} from '@google/generative-ai'
const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


const askGenie =  asyncHandler(async (req,res)=>{
  const { doubt } = req.body;
  
  if (!doubt) throw new ApiError(400,"No Doubt Provided...")

  try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" ,
      });

      const result = await model.generateContent(doubt);
      const response = result.response.text(); // Extract the response text

      res.json({ reply: response });
  } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch response" });
  }
})

router.route('/ask-doubt').post(askGenie)

export default router;