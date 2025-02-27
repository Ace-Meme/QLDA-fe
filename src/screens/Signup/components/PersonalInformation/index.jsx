import React from "react";
import styles from "./style.module.css";
import { Form, Input, Select } from "antd";
function PersonalInformation(props) {
    const { Option } = Select;
    const [form] = Form.useForm();
    const prefixSelector = (
        <Form.Item
            name="prefix"
            noStyle
        >
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );
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
                    ]}
                >
                    <Input placeholder="Nguyen Quoc Nhut" />
                </Form.Item>
                <Form.Item
                    name="national_id"
                    label="National ID number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your national ID number!",
                        },
                    ]}
                >
                    <Input placeholder="097" />
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
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone number!",
                        },
                    ]}
                >
                    <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
            </Form>
        </div>
    );
}

export default PersonalInformation;
