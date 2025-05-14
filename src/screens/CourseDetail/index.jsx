import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../../utils/Link";
import { Button, InputNumber, message, Spin, Tabs, Tag, Collapse, Divider } from "antd";
import { Form, Input, Modal } from "antd";
import { IoDocumentAttachOutline } from "react-icons/io5";

import {
    FaRegEdit,
    FaPlay,
    FaFileAlt,
    FaClock,
    FaBook,
    FaCalendarAlt,
    FaShoppingCart,
    FaCheckCircle,
} from "react-icons/fa";
import { HiOutlineArrowLeft } from "react-icons/hi";
import styles from "./style.module.css";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;
const { Panel } = Collapse;

export function CourseDetail() {
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState("information");
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const { userRole } = useSelector((state) => state.authentication);
    const [showNewWeekModal, setShowNewWeekModal] = useState(false);
    const [form] = Form.useForm();
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCourseData, setEditCourseData] = useState({});

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const handleBuy = () => {
        setShowBuyModal(true);
        setNotification(null);
    };

    const handleCloseBuy = () => setShowBuyModal(false);
    const handleCloseEdit = () => setShowEditModal(false);

    const handleEdit = () => {
        setEditCourseData({
            name: course.name,
            description: course.description,
            summary: course.summary,
            price: course.price,
            thumbnailUrl: course.thumbnailUrl,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditCourseData({ ...editCourseData, [e.target.name]: e.target.value });
    };

    const saveEdit = async () => {
        setModalLoading(true);
        try {
            const res = await axios.put(`${baseURL}/courses/${course.id}`, editCourseData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourse(res.data);
            setShowEditModal(false);
            message.success("Course updated successfully!");
        } catch (err) {
            console.error(err);
            message.error("Failed to update course.");
        } finally {
            setModalLoading(false);
        }
    };

    const buyCourse = async () => {
        setModalLoading(true);
        try {
            await axios.post(
                `${baseURL}/enrollments`,
                { courseId: course.id },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setNotification({
                type: "success",
                message: "Successfully enrolled in the course!",
            });
        } catch (err) {
            setNotification({
                type: "error",
                message: err.response?.data?.message || "There was an error enrolling, or you're already enrolled",
            });
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseURL}/courses/${state}`);
                setCourse(res.data);
            } catch (err) {
                console.error(err);
                message.error("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [state]);

    const handleNewWeekSubmit = async () => {
        try {
            const values = await form.validateFields();
            const newWeekData = {
                ...values,
                courseId: course?.id || 0,
            };

            const res = await axios.post(`${baseURL}/weeks`, newWeekData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success("New week created successfully!");
            setCourse((prev) => ({
                ...prev,
                weeks: [...prev.weeks, res.data],
            }));
            setShowNewWeekModal(false);
            form.resetFields();
        } catch (err) {
            console.error(err);
            if (err.response?.data?.message) {
                message.error(err.response.data.message);
            } else {
                message.error("Failed to create a new week.");
            }
        }
    };

    const toChapterDetail = (chapNumber, chapName, description, lessons, chapterId) => {
        navigate(`/chapter/${chapNumber}`, {
            state: { chapNumber, chapName, description, lessons, chapterId },
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Button
                type="text"
                icon={<HiOutlineArrowLeft />}
                onClick={() => navigate(-1)}
                className={styles.backButton}
            >
                Back to Courses
            </Button>

            <div className={styles.courseHeader}>
                <div className={styles.courseThumbnail}>
                    <img
                        src={
                            course.thumbnailUrl ||
                            "https://images.unsplash.com/photo-1542621334-a254cf47733d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=400&q=80"
                        }
                        alt={course.name}
                    />
                    {course.isFree && (
                        <Tag
                            color="green"
                            className={styles.freeTag}
                        >
                            FREE
                        </Tag>
                    )}
                </div>

                <div className={styles.courseMeta}>
                    <h1 className={styles.courseTitle}>{course.name}</h1>
                    <p className={styles.courseInstructor}>By {course.teacherName}</p>

                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <FaBook />
                            <span>{course.numberOfLessons} Lessons</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FaClock />
                            <span>{course.totalDurationMinutes} Minutes</span>
                        </div>
                        <div className={styles.metaItem}>
                            <FaCalendarAlt />
                            <span>{course.estimatedWeeks} Weeks</span>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        {userRole === "STUDENT" && (
                            <Button
                                type="primary"
                                size="large"
                                icon={<FaShoppingCart />}
                                onClick={handleBuy}
                                className={styles.enrollButton}
                            >
                                {course.price === 0 ? "Enroll Now" : `Enroll for $${course.price}`}
                            </Button>
                        )}
                        {userRole === "TEACHER" && (
                            <Button
                                icon={<FaRegEdit />}
                                onClick={handleEdit}
                                className={styles.editButton}
                            >
                                Edit Course
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.courseContent}>
                <div className={styles.mainContent}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className={styles.tabs}
                    >
                        <TabPane
                            tab="About This Course"
                            key="information"
                        >
                            <div className={styles.tabContent}>
                                <h2>Course Description</h2>
                                <p className={styles.description}>{course.description}</p>

                                <h2>What You'll Learn</h2>
                                <ul className={styles.learningPoints}>
                                    {course.summary
                                        ?.split(". ")
                                        .filter(Boolean)
                                        .map((point, i) => (
                                            <li key={i}>
                                                <FaCheckCircle className={styles.checkIcon} />
                                                {point.trim()}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </TabPane>
                        <TabPane
                            tab="Course Content"
                            key="content"
                        >
                            <div className={styles.tabContent}>
                                <div className={styles.contentHeader}>
                                    <h2>Course Curriculum</h2>
                                    {/* {userRole === "TEACHER" && (
                                        <Button
                                            type="primary"
                                            onClick={handleEdit}
                                            className={styles.editButton}
                                        >
                                            Edit Course
                                        </Button>
                                    )} */}
                                    {userRole === "TEACHER" && (
                                        <Button
                                            type="primary"
                                            onClick={() => setShowNewWeekModal(true)}
                                        >
                                            Add New Chapter
                                        </Button>
                                    )}
                                </div>

                                <Collapse
                                    accordion
                                    className={styles.chapterAccordion}
                                    expandIconPosition="end"
                                >
                                    {course.weeks?.map((week, index) => (
                                        <Panel
                                            key={week.id}
                                            header={
                                                <div className={styles.chapterHeader}>
                                                    <span className={styles.chapterTitle}>
                                                        Chapter {week.weekNumber}: {week.title}
                                                    </span>
                                                    <span className={styles.chapterDuration}>
                                                        {week.learningItems?.reduce(
                                                            (sum, item) => sum + item.durationMinutes,
                                                            0,
                                                        )}{" "}
                                                        min
                                                    </span>
                                                </div>
                                            }
                                        >
                                            <div className={styles.chapterContent}>
                                                <div className={styles.chapterDescription}>
                                                    <p>{week.description}</p>
                                                    {userRole === "TEACHER" ? (
                                                        <Button
                                                            type="text"
                                                            icon={<FaRegEdit />}
                                                            onClick={() =>
                                                                toChapterDetail(
                                                                    week.weekNumber,
                                                                    week.title,
                                                                    week.description,
                                                                    week.learningItems,
                                                                    week.id,
                                                                )
                                                            }
                                                            className={styles.editChapterButton}
                                                        >
                                                            Edit Chapter
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="text"
                                                            icon={<IoDocumentAttachOutline />}
                                                            onClick={() =>
                                                                toChapterDetail(
                                                                    week.weekNumber,
                                                                    week.title,
                                                                    week.description,
                                                                    week.learningItems,
                                                                    week.id,
                                                                )
                                                            }
                                                            className={styles.editChapterButton}
                                                        >
                                                            Chapter Materials
                                                        </Button>
                                                    )}
                                                </div>

                                                <Divider />

                                                <ul className={styles.lessonList}>
                                                    {week.learningItems?.map((item, idx) => (
                                                        <li
                                                            key={idx}
                                                            className={styles.lessonItem}
                                                        >
                                                            <div className={styles.lessonIcon}>
                                                                {item.type === "VIDEO" ? (
                                                                    <FaPlay className={styles.videoIcon} />
                                                                ) : (
                                                                    <FaFileAlt className={styles.docIcon} />
                                                                )}
                                                            </div>
                                                            <div className={styles.lessonContent}>
                                                                <h4>{item.title}</h4>
                                                                <p>{item.content}</p>
                                                                <span className={styles.lessonDuration}>
                                                                    {item.durationMinutes} min
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.priceCard}>
                        <h3>Course Price</h3>
                        <div className={styles.price}>{course.price === 0 ? "Free" : `$${course.price}`}</div>
                        {userRole === "STUDENT" && (
                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={handleBuy}
                                className={styles.buyButton}
                            >
                                Enroll Now
                            </Button>
                        )}
                    </div>

                    <div className={styles.includesCard}>
                        <h3>This Course Includes</h3>
                        <ul>
                            <li>
                                <FaPlay className={styles.includeIcon} />
                                {course.numberOfLessons} on-demand lessons
                            </li>
                            <li>
                                <FaClock className={styles.includeIcon} />
                                {course.totalDurationMinutes} minutes of content
                            </li>
                            <li>
                                <FaFileAlt className={styles.includeIcon} />
                                Downloadable resources
                            </li>
                            <li>
                                <FaCalendarAlt className={styles.includeIcon} />
                                {course.estimatedWeeks} weeks of access
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* New Week Modal */}
            <Modal
                title="Create New Chapter"
                visible={showNewWeekModal}
                onCancel={() => setShowNewWeekModal(false)}
                onOk={handleNewWeekSubmit}
                okText="Create Chapter"
                cancelText="Cancel"
                width={600}
                confirmLoading={modalLoading}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Chapter Title"
                        name="title"
                        rules={[
                            { required: true, message: "Please enter the chapter title" },
                            { max: 100, message: "Title must be less than 100 characters" },
                        ]}
                    >
                        <Input placeholder="e.g. Introduction to React" />
                    </Form.Item>
                    <Form.Item
                        label="Chapter Number"
                        name="weekNumber"
                        rules={[
                            { required: true, message: "Please enter the chapter number" },
                            { type: "number", min: 1, message: "Chapter number must be greater than 0" },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="e.g. 1 for Chapter 1"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: "Please enter the description" },
                            { max: 500, message: "Description must be less than 500 characters" },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Brief description of what this chapter covers..."
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Buy Modal */}
            <Modal
                title={`Enroll in ${course?.name}`}
                visible={showBuyModal}
                onCancel={handleCloseBuy}
                footer={null}
                width={500}
            >
                <div className={styles.enrollModal}>
                    <div className={styles.enrollHeader}>
                        <h3>{course?.name}</h3>
                        <p>By {course?.teacherName}</p>
                    </div>

                    <div className={styles.priceDisplay}>
                        <span>Price:</span>
                        <span className={styles.modalPrice}>{course?.price === 0 ? "Free" : `$${course?.price}`}</span>
                    </div>

                    {notification && (
                        <div className={notification.type === "success" ? styles.successMessage : styles.errorMessage}>
                            {notification.message}
                        </div>
                    )}
                    {userRole === "STUDENT" && (
                        <Button
                            type="primary"
                            block
                            size="large"
                            onClick={buyCourse}
                            loading={modalLoading}
                            className={styles.enrollConfirmButton}
                        >
                            {course?.price === 0 ? "Enroll for Free" : "Complete Enrollment"}
                        </Button>
                    )}

                    {course?.price > 0 && (
                        <div className={styles.paymentMethods}>
                            <p>Secure payment processed by our payment partner</p>
                            <div className={styles.paymentIcons}>
                                {/* Add payment method icons here */}
                                <span>VISA</span>
                                <span>MASTERCARD</span>
                                <span>PAYPAL</span>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit Course Details"
                visible={showEditModal}
                onCancel={handleCloseEdit}
                onOk={saveEdit}
                okText="Save Changes"
                cancelText="Cancel"
                width={700}
                confirmLoading={modalLoading}
            >
                <Form layout="vertical">
                    <Form.Item label="Course Name">
                        <Input
                            name="name"
                            value={editCourseData.name}
                            onChange={handleEditChange}
                        />
                    </Form.Item>

                    <Form.Item label="Thumbnail URL">
                        <Input
                            name="thumbnailUrl"
                            value={editCourseData.thumbnailUrl}
                            onChange={handleEditChange}
                        />
                    </Form.Item>

                    <Form.Item label="Price">
                        <InputNumber
                            name="price"
                            value={editCourseData.price}
                            onChange={(value) => setEditCourseData({ ...editCourseData, price: value })}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item label="Summary">
                        <Input.TextArea
                            name="summary"
                            value={editCourseData.summary}
                            onChange={handleEditChange}
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item label="Description">
                        <Input.TextArea
                            name="description"
                            value={editCourseData.description}
                            onChange={handleEditChange}
                            rows={6}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
