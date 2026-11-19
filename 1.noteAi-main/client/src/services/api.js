import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice.js"

export const getCurrentUser = async (dispatch) =>{
    try{
   
        const result = await 
        axios.get(serverUrl + "/api/user/currentuser",
            {withCredentials:true})
                 
            dispatch(setUserData(result.data))
  }
    catch (error){
        console.error("Error fetching current user:", error.message)
        if (error.response) {
            console.error("Server responded with:", error.response.status)
        } else if (error.request) {
            console.error("No response from server")
        }
    }
}
export const generateNotes = async (payload) => {
try {     
const result = await
   axios.post(serverUrl + "/api/notes/generate-notes", payload, {withCredentials:true})
  
return result.data
}
catch (error){
console.error("Error generating notes:", error.message)
if (error.response) {
    console.error("Server error:", error.response.status, error.response.data)
    throw new Error(
        error.response.data?.error ||
        error.response.data?.message ||
        "Failed to generate notes"
    )
} else if (error.request) {
    console.error("No response from server - check if backend is running")
    throw new Error("Server not responding. Please check if the backend is running.")
} else {
    throw new Error(error.message)
}
}
}



export const downloadPdf = async (result) => {
  try {
    const response = await axios.post(serverUrl + "/api/pdf/generate-pdf", { result }, {
      responseType: "blob",
      withCredentials: true
    })

    const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("PDF download failed");
  }
}
