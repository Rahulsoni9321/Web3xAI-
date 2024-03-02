import axios from "axios";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { inputquestion, replyatom } from "./atom";

function Inputdata():any{
  const [queries,setqueries]:any=useRecoilState(inputquestion);
  return <>
         <input
            onChange={(e) => {
              setqueries(e.target.value);
            }}
            placeholder="Ask me anything..."
            value={queries}
          />
  </>
}

function Button():any{
  const [query,setquery]=useRecoilState(inputquestion);
  const setanswer=useSetRecoilState(replyatom);
  const [loading,setloading]=useState(true)

  return<>
   <button  className=" btn btn-primary h-4 mx-5"
            onClick={async () => {
             setanswer("")
             setloading(false)
              try {
                const response = await axios.post(
                  "http://localhost:3000/rag_request",
                  {
                    input: query,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                setloading(true);
                setquery("")
                setanswer(response.data.answer.answer);
              } 
              catch (error: any) {
               console.error(`this is the error ${error}`);
              }
            }}
          >
            {
              loading ? "Send" : "Sending..."
            }
           
          </button>
  </>
} 
function App(): any {
  const  answer:any=useRecoilValue(replyatom)
  const [uploadedfiles,setuploadedfiles]:any=useState("")

 
  return (
    <>
      <div className="flex items-center">
           <Inputdata></Inputdata>
          <Button></Button>
          
          <input type="file" onChange={(e)=>{
            setuploadedfiles(e.target.files[0]);

          }} className="file-input file-input-bordered w-full max-w-xs" />
          <button className="btn btn-secondary"
          onClick={async ()=>{
              const formdata=new FormData();
              formdata.append("file",uploadedfiles)
               await axios.post("http://localhost:3000/upload/single",
               
                    formdata
               ,{
                headers:{
                  "Content-Type":"multipart/form-data"
                }
               })
          }}>Submit file</button>
         
          
        </div>
        <div>{answer ? <div>{answer}</div> : "Loading...."}</div>
      
    </>
  );
}



export default App;
