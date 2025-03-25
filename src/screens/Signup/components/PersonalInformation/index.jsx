import { DatePicker, Form, Input, Select } from "antd";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { updateName, updateGender, updateEmail, updatePhone, updateDob } from "../../../../redux/SignUpSlice";
import { useEffect } from "react";

function PersonalInformation() {
    const { Option } = Select;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const signUpInfo = useSelector((state) => state.signUp);

    useEffect(() => {
        console.log("Sign Up Information: ", signUpInfo);
    });

    const validateFullName = (rule, value) => {
        if (!value || value.length < 5 || !/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
            return Promise.reject("Full name must be at least 5 characters long and contain only letters.");
        }
        return Promise.resolve();
    };

    const validatePhoneNumber = (rule, value) => {
        if (!value || !/^0\d{9}$/.test(value)) {
            return Promise.reject("Phone number must be a sequence of 10 digits starting with 0.");
        }
        return Promise.resolve();
    };

    return (
        <div className={styles.container}>
            <Form
                form={form}
                name="personal_information"
                layout="vertical"
            >
                <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your fullname!",
                        },
                        {
                            validator: validateFullName,
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => dispatch(updateName(e.target.value))}
                        placeholder="Nguyen Quoc Nhut"
                    />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[
                        {
                            required: true,
                            message: "Please select your gender!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select gender"
                        allowClear
                        onChange={(value) => dispatch(updateGender(value))}
                    >
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                        <Option value="OTHER">Other</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                >
                    <Input onChange={(e) => dispatch(updateEmail(e.target.value))} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone number!",
                        },
                        {
                            validator: validatePhoneNumber,
                        },
                    ]}
                >
                    <Input
                        onChange={(e) => dispatch(updatePhone(e.target.value))}
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="dob"
                    label="Birthday"
                    rules={[
                        {
                            required: true,
                            message: "Please select your day of birth!",
                        },
                    ]}
                >
                    <DatePicker
                        onChange={(date, dateString) => dispatch(updateDob(Number(dateString)))}
                        picker="year"
                    />
                </Form.Item>
            </Form>
        </div>
    );
}

export default PersonalInformation;
