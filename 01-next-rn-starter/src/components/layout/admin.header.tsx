"use client";
import { Layout, theme } from "antd";

const { Header } = Layout;

export default function AdminHeader() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return <Header style={{ padding: 0, background: "#ccc" }} />;
}
