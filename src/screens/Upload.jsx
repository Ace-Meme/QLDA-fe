import React, { useState } from "react";
import axios from "axios";
import { Upload, Button, Input, message, Switch } from "antd";
import { baseURL } from "../utils/Link";
const UploadDocument = ({ lessonId, token, onClose }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isVideo, setIsVideo] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file || !title) {
            message.warning("Vui lòng chọn file và nhập tiêu đề!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("isVideo", isVideo);

        try {
            setUploading(true);
            await axios.post(`${baseURL}/learning-items/${lessonId}/documents`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success("Tải tài liệu thành công!");
            setFile(null);
            setTitle("");
            setDescription("");
            setIsVideo(false);
        } catch (err) {
            console.error(err);
            message.error("Tải tài liệu thất bại!");
        } finally {
            setUploading(false);
            onClose(); // Đóng modal sau khi tải lên thành công
        }
    };

    return (
        <div style={{ maxWidth: 500, marginTop: 20 }}>
            <Input
                placeholder="Tiêu đề tài liệu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <Input.TextArea
                placeholder="Mô tả (tuỳ chọn)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch
                    checked={isVideo}
                    onChange={(checked) => setIsVideo(checked)}
                    checkedChildren="Video"
                    unCheckedChildren="Tài liệu"
                    style={{ marginBottom: 8 }}
                />
                <Upload
                    beforeUpload={(file) => {
                        setFile(file);
                        return false; // Không tự upload
                    }}
                    style={{ marginLeft: 8 }}
                    showUploadList={file ? [{ name: file.name }] : false}
                    maxCount={1}
                >
                    <Button>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={uploading}
                >
                    Tải lên
                </Button>
            </div>
        </div>
    );
};

export default UploadDocument;
