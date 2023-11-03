import DashboardHeading from 'module/dashboard/DashboardHeading';
import React from 'react';
import { useState } from 'react';
import UserTable from './UserTable';

const UserManage = () => {
    return (
        <div>
            <DashboardHeading title="Users" desc="Manage your user"></DashboardHeading>
            <UserTable></UserTable>
        </div>
    );
};

export default UserManage;
