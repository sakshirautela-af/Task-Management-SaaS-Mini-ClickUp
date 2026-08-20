import { useState } from "react";
export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState();
  const handleSubmit = async () => {
    try {
      if (!file) {
        setError("please upload file");
        return;
      }
      const response = await UploadFile(file);
      console.log("file uploaded successfully");
      setError(null);
    } catch (error) {
      setError("an error occur");
    }
  };
  return (
    <div className="file-upload">
      <input type="file" onChange={(e) => setFile(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
