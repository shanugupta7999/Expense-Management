import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./UploadBill.css"; // Import the new CSS file for styling

const UploadBill = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      message.error("Please upload a file first!");
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append("bill", file);
    formData.append("user", user._id);

    try {
      const response = await axios.post("/bills/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Bill uploaded successfully");
      setFile(null);
      console.log("Extracted Data: ", response.data);
    } catch (error) {
      message.error("Failed to upload bill");
      console.error("error");
    }
  };

  return (
    <div className="upload-bill-container">
      <div className="upload-section">
        <h1 className="upload-page-title">Upload Bills</h1> {/* New page title */}
        <h2 className="upload-title">Upload Your Bill</h2>
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false; // Prevent automatic upload by antd
          }}
          fileList={file ? [file] : []}
          className="upload-button"
        >
          <Button icon={<UploadOutlined />}>Select Bill File</Button>
        </Upload>
        <Button 
          // type="primary" 
          onClick={handleUpload} 
          className="submit-button"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UploadBill;
