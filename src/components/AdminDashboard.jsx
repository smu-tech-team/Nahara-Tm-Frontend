import { useState } from "react";
import Head from "./AdminHeader"
import AdminAnalytics from "./AdminAnalytics";
import CreatorList from "./CreatorList";
import ActionButtons from "./ActionButtons";

const AdminDashboard = () => {

    return (
        <div className="admin-dashboard p-6">
            <Head />
            <AdminAnalytics />
            <ActionButtons/>
            <CreatorList />
        </div>
    );
};

export default AdminDashboard;
