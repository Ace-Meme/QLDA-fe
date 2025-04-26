import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import styles from "./style.module.css";
import { useLocation, useNavigate } from "react-router";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Descriptions, Menu, Tag, Button, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { BsTicketDetailed } from "react-icons/bs";
import { GrResources } from "react-icons/gr";
import axios from "axios";
import { baseURL } from "../../utils/Link";
import UploadDocument from "../Upload";

const token = sessionStorage.getItem("token");
const items = [
    {
        label: "Detail",
        key: "detail",
        icon: <BsTicketDetailed />,
    },
    {
        label: "Resources",
        key: "resources",
        icon: <GrResources />,
    },
];

function ChapterDetail() {
    const [lessons, setLessons] = useState([]);
    const [documents, setDocuments] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState("detail");

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const {
        chapNumber = 1,
        chapName = "New chapter",
        title = "Chapter",
        description = "",
        chapterId = 0,
    } = location.state || {};

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${baseURL}/learning-items/week/${chapterId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.result === "SUCCESS") {
                    setLessons(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };
        fetchLessons();
    }, [chapterId]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`${baseURL}/documents/lesson/27`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.result === "SUCCESS") {
                    setDocuments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        };
        fetchDocuments();
    }, [chapterId]);

    useEffect(() => {
        console.log("Lessons:", lessons);
    }, [lessons]);

    const getColor = (type) => {
        switch (type) {
            case "DOCUMENT":
                return "green";
            case "EXERCISE":
                return "blue";
            case "QUIZ":
                return "orange";
            default:
                return "default";
        }
    };

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                orderIndex: lessons.length + 1,
                weekId: chapterId,
            };

            await axios.post(`${baseURL}/learning-items`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success("Thêm lesson thành công!");
            handleCancel();
        } catch (error) {
            console.error("Error submitting lesson:", error);
            message.error("Thêm lesson thất bại!");
        }
    };

    const handleDownloadDocument = async (id, fileName) => {
        try {
            const response = await axios.get(`${baseURL}/documents/${id}/download`, {
                responseType: "blob", // rất quan trọng để tải file
                headers: {
                    Authorization: `Bearer ${token}`, // nếu cần token
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || "document.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Lỗi tải tài liệu:", error);
        }
    };
    const [upload, setUpload] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FaChevronLeft
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(-1)}
                />
                <h3>{`Chapter ${chapNumber} - ${chapName}`}</h3>
            </div>

            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
            />

            {current === "detail" ? (
                <div className={styles.content}>
                    <div className={styles["info-container"]}>
                        <p className={styles["title"]}>Title</p>
                        <p
                            style={{
                                fontSize: "20px",
                                color: "#0F172A",
                                fontWeight: 500,
                            }}
                        >
                            {chapName}
                        </p>
                    </div>
                    <div className={styles["info-container"]}>
                        <p className={styles["title"]}>Description</p>
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#0F172A",
                                fontWeight: 500,
                            }}
                        >
                            {description}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ margin: 16, textAlign: "left" }}>
                        <Button
                            type="primary"
                            onClick={showModal}
                        >
                            Add Lesson
                        </Button>
                    </div>

                    {lessons?.map((lesson, index) => {
                        const color = getColor(lesson.type);
                        return (
                            <div
                                className={styles["info-container"]}
                                key={lesson.id}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <p className={styles["title"]}>
                                        {`Lesson ${index + 1}: ${lesson.title} (${lesson.durationMinutes} mins)`}
                                    </p>
                                    <Tag
                                        style={{ height: "fit-content" }}
                                        color={color}
                                    >
                                        {lesson.type}
                                    </Tag>
                                </div>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        color: "#0F172A",
                                        fontWeight: 500,
                                    }}
                                >
                                    {lesson.content}
                                </p>
                                {documents?.map((doc) => {
                                    return (
                                        <div key={doc.id}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDownloadDocument(doc.id, doc.fileName);
                                                }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {doc.fileName}
                                            </a>
                                        </div>
                                    );
                                })}
                                <Button
                                    style={{ marginTop: "12px" }}
                                    onClick={() => setUpload(true)}
                                >
                                    Upload Resources
                                </Button>
                                {upload && (
                                    <UploadDocument
                                        token={token}
                                        lessonId={lesson.id}
                                        onClose={() => setUpload(false)}
                                    />
                                )}
                            </div>
                        );
                    })}

                    <Modal
                        title="Add New Lesson"
                        open={isModalOpen}
                        onOk={handleSubmit}
                        onCancel={handleCancel}
                        okText="Add"
                        cancelText="Cancel"
                    >
                        <Form
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={[
                                        { label: "VIDEO", value: "VIDEO" },
                                        { label: "DOCUMENT", value: "DOCUMENT" },
                                        { label: "EXERCISE", value: "EXERCISE" },
                                        { label: "QUIZ", value: "QUIZ" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Description"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item
                                name="durationMinutes"
                                label="Duration(minutes)"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            )}
        </div>
    );
}

export default ChapterDetail;
