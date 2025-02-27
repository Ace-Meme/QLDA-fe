import styles from "./style.module.css";
import { Form, Input, Select } from "antd";
function ProfileData() {
    const {Option} = Select;
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
                    name="fullnameofparent"
                    label="Full name of parent"
                    rules={[
                        {
                            required: true,
                            message: "Please input your fullname of parent!",
                        },
                    ]}
                >
                    <Input placeholder="Nguyen Quoc A" />
                </Form.Item>
                <Form.Item
                    name="dob_parent"
                    label="Date of parent's birth"
                    rules={[
                        {
                            required: true,
                            message: "Please input your date of parent's birth",
                        },
                    ]}
                >
                    <Input placeholder="22/02/2024" />
                </Form.Item>

                <Form.Item
                    name="parent_address"
                    label="Parent's permanent resident"
                    rules={[
                        {
                            required: true,
                            message: "Please input your parent's permanent resident!",
                        },
                    ]}
                >
                    <Input placeholder="Di An, Binh Duong" />
                </Form.Item>
                <Form.Item
                    name="parent_phone"
                    label="Parent's phone number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your parent's phone number!",
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

export default ProfileData;
