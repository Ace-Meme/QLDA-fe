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
import { startQuizAttempt } from "../../api";
import { getTokenData } from "../../utils/auth";

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
    const [quizBanks, setQuizBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isQuizBankModalOpen, setIsQuizBankModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [quizBankForm] = Form.useForm();

    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState("detail");

    useEffect(() => {
        // Get user role from token
        const tokenData = getTokenData();
        if (tokenData && tokenData.role) {
            setUserRole(tokenData.role);
        }
    }, []);

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
                setLoading(true);
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
                message.error("Failed to fetch lessons");
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [chapterId]);

    useEffect(() => {
        const fetchQuizBanks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/quiz-banks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.result === "SUCCESS") {
                    setQuizBanks(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching quiz banks:", error);
                message.error("Failed to fetch quiz banks");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizBanks();
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/documents/lesson/${chapterId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.result === "SUCCESS") {
                    setDocuments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
                message.error("Failed to fetch documents");
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [chapterId]);

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
            setLoading(true);
            const values = await form.validateFields();
            const payload = {
                ...values,
                orderIndex: lessons.length + 1,
                weekId: chapterId,
            };

            // First create the learning item
            const response = await axios.post(`${baseURL}/learning-items`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.result === "SUCCESS" && values.type === "QUIZ" && values.quizBankId) {
                // If it's a quiz, associate it with the selected quiz bank
                await axios.put(`${baseURL}/api/quiz-banks/${values.quizBankId}/learning-items`, {
                    learningItemId: response.data.data.id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            message.success("Lesson added successfully!");
            handleCancel();
            // Refresh lessons list
            const updatedResponse = await axios.get(`${baseURL}/learning-items/week/${chapterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (updatedResponse.data.result === "SUCCESS") {
                setLessons(updatedResponse.data.data);
            }
        } catch (error) {
            console.error("Error submitting lesson:", error);
            message.error("Failed to add lesson");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadDocument = async (id, fileName) => {
        try {
            const response = await axios.get(`${baseURL}/documents/${id}/download`, {
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
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
            console.error("Error downloading document:", error);
            message.error("Failed to download document");
        }
    };

    const handleStartQuiz = async (learningItemId) => {
        try {
            setLoading(true);
            const response = await startQuizAttempt(learningItemId);
            if (response.result === "SUCCESS") {
                navigate(`/quiz-attempt/${learningItemId}`);
            } else {
                message.error("Failed to start quiz");
            }
        } catch (error) {
            console.error("Error starting quiz:", error);
            message.error("Failed to start quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeQuizBank = async (values) => {
        try {
            setLoading(true);
            if (!selectedLesson) return;

            // Update the learning item with new quiz bank
            await axios.put(`${baseURL}/api/quiz-banks/${values.quizBankId}/learning-items`, {
                learningItemId: selectedLesson.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success("Quiz bank updated successfully!");
            setIsQuizBankModalOpen(false);
            quizBankForm.resetFields();

            // Refresh lessons list
            const updatedResponse = await axios.get(`${baseURL}/learning-items/week/${chapterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (updatedResponse.data.result === "SUCCESS") {
                setLessons(updatedResponse.data.data);
            }
        } catch (error) {
            console.error("Error updating quiz bank:", error);
            message.error("Failed to update quiz bank");
        } finally {
            setLoading(false);
        }
    };

    const showQuizBankModal = (lesson) => {
        setSelectedLesson(lesson);
        quizBankForm.setFieldsValue({
            quizBankId: lesson.quizBank?.id
        });
        setIsQuizBankModalOpen(true);
    };

    const handleCancelQuizBankModal = () => {
        setIsQuizBankModalOpen(false);
        setSelectedLesson(null);
        quizBankForm.resetFields();
    };

    const [upload, setUpload] = useState(false);

    const isTeacher = userRole === "TEACHER";
    const isStudent = userRole === "STUDENT";

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
                    {isTeacher && (
                        <div style={{ margin: 16, textAlign: "left" }}>
                            <Button
                                type="primary"
                                onClick={showModal}
                                loading={loading}
                            >
                                Add Lesson
                            </Button>
                        </div>
                    )}

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
                                {lesson.type === "QUIZ" && isStudent && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleStartQuiz(lesson.id)}
                                        loading={loading}
                                        style={{ marginTop: "12px", marginRight: "12px" }}
                                    >
                                        Start Quiz
                                    </Button>
                                )}
                                {lesson.type === "QUIZ" && isTeacher && (
                                    <Button
                                        type="primary"
                                        onClick={() => showQuizBankModal(lesson)}
                                        loading={loading}
                                        style={{ marginTop: "12px", marginRight: "12px" }}
                                    >
                                        Change Quiz Bank
                                    </Button>
                                )}
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
                                {isTeacher && (
                                    <Button
                                        style={{ marginTop: "12px" }}
                                        onClick={() => setUpload(true)}
                                        loading={loading}
                                    >
                                        Upload Resources
                                    </Button>
                                )}
                                {upload && isTeacher && (
                                    <UploadDocument
                                        token={token}
                                        lessonId={lesson.id}
                                        onClose={() => setUpload(false)}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {isTeacher && (
                        <Modal
                            title="Add New Lesson"
                            open={isModalOpen}
                            onOk={handleSubmit}
                            onCancel={handleCancel}
                            okText="Add"
                            cancelText="Cancel"
                            confirmLoading={loading}
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
                                    noStyle
                                    shouldUpdate={(prevValues, currentValues) =>
                                        prevValues.type !== currentValues.type
                                    }
                                >
                                    {({ getFieldValue }) =>
                                        getFieldValue("type") === "QUIZ" ? (
                                            <Form.Item
                                                name="quizBankId"
                                                label="Quiz Bank"
                                                rules={[{ required: true }]}
                                            >
                                                <Select
                                                    options={quizBanks.map((bank) => ({
                                                        label: bank.title,
                                                        value: bank.id,
                                                    }))}
                                                />
                                            </Form.Item>
                                        ) : null
                                    }
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
                    )}

                    {isTeacher && (
                        <Modal
                            title="Change Quiz Bank"
                            open={isQuizBankModalOpen}
                            onOk={() => quizBankForm.submit()}
                            onCancel={handleCancelQuizBankModal}
                            okText="Update"
                            cancelText="Cancel"
                            confirmLoading={loading}
                        >
                            <Form
                                layout="vertical"
                                form={quizBankForm}
                                onFinish={handleChangeQuizBank}
                            >
                                <Form.Item
                                    name="quizBankId"
                                    label="Quiz Bank"
                                    rules={[{ required: true, message: 'Please select a quiz bank' }]}
                                >
                                    <Select
                                        options={quizBanks.map((bank) => ({
                                            label: bank.title,
                                            value: bank.id,
                                        }))}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    )}
                </>
            )}
        </div>
    );
}

export default ChapterDetail;
