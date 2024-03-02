import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });


const Endpoint:any=process.env.FLOCK_BOT_ENDPOINT
export function flockModel():any {

  async function sendrequest():Promise<any>{
    try {
      
        const payload:any= {
          question: "What is your name?",
          chat_history: [],
          knowledge_source_id: "7715939322", // replace with your model id
        };
    
        // Set the headers
        const headers:any = {
          "x-api-key": process.env.FLOCK_BOT_API_KEY, // Ensure API key is set in .env
        };
    
    const response = await axios.post(Endpoint,payload,{headers:headers});
        return response.data;
    }
  
  catch (error) {
    console.error("Error:", error);
  }
}
sendrequest();




}