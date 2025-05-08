"use client";

import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { useState } from "react";
import { useHasMounted } from "../../utils/customHook";
import {
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const ModalReactive = (props: any) => {
    const hasMounted = useHasMounted();
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);

    const [userId, setUserId] = useState("");

    if (!hasMounted) return <></>;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinishStep0 = async (value: any) => {
        const { email } = value;
        const res = await sendRequest<IBackendRes<any>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            body: {
                email,
            },
        });

        if (res?.data) {
            setUserId(res?.data?._id);
            setCurrent(1);
        } else {
            notification.error({
                message: "Call api login",
                description: res?.message,
            });
        }
    };

    const onFinishStep1 = async (value: any) => {
        const { code } = value;
        const res = await sendRequest<IBackendRes<any>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            body: {
                code,
                _id: userId,
            },
        });

        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Call api login",
                description: res?.message,
            });
        }
    };

    return (
        <Modal
            title="Kích hoạt tài khoản"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={handleCancel}
            maskClosable={false}
            footer={null}
        >
            <Steps
                current={current}
                items={[
                    {
                        title: "Login",
                        // status: "finish",
                        icon: <UserOutlined />,
                    },
                    {
                        title: "Verification",
                        // status: "finish",
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: "Done",
                        // status: "wait",
                        icon: <SmileOutlined />,
                    },
                ]}
            />
            {current === 0 && (
                <div>
                    <span>Tài khoản chưa được kích hoạt</span>
                    <Form
                        name="reactive-form"
                        onFinish={onFinishStep0}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label=""
                            name="email"
                            initialValue={userEmail}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Resend
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
            {current === 1 && (
                <div>
                    <span>Vui lòng nhập mã xác nhận</span>
                    <Form
                        name="reactive-form-1"
                        onFinish={onFinishStep1}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your code!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Active
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
            {current === 2 && (
                <div>
                    <span>
                        Tài khoản của bạn đã được kích hoạt thành công, vui lòng
                        đăng nhập lại
                    </span>
                </div>
            )}
        </Modal>
    );
};

export default ModalReactive;
