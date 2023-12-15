import DashboardHeading from 'module/dashboard/DashboardHeading';
import React from 'react';
import { useAuth } from 'contexts/auth-context';
import UserTable from './UserTable';
import { Button } from 'components/button';
import { userRole } from 'utils/constants';
const UserManage = () => {
    const { userInfo } = useAuth();
    if (userInfo.role !== userRole.ADMIN)
        return (
            <div className="text-2xl font-bold text-red-400 text-center">
                You don't have right to access this page
            </div>
        );
    return (
        <div>
            <DashboardHeading
                title="Users"
                desc="Manage your user"
            ></DashboardHeading>
            <div className="flex justify-end mb-10">
                <Button to="/manage/add-user" kind="ghost">
                    Add new user
                </Button>
            </div>
            <UserTable></UserTable>
        </div>
    );
};

export default UserManage;
