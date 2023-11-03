import { ActionDelete, ActionEdit, ActionView } from 'components/action';
import { Button } from 'components/button';
import { LabelStatus } from 'components/label';
import { Table } from 'components/table';
import { db } from 'firebase-app/firebase-config';
import { collection, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import React, { useEffect, useState } from 'react';
import { categoryStatus } from 'utils/constants';
import Swal from 'sweetalert2';

const CategoryManage = () => {
    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'categories');
        onSnapshot(colRef, (snapshot) => {
            let result = [];
            snapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategoryList(result);
        });
    }, []);

    const handleDeleteCategory = async (docId) => {
        const colRef = doc(db, 'categories', docId);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(colRef);
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        });
        // await db.collection('categories').doc(docId).delete();
    };
    return (
        <div>
            <DashboardHeading title="Categories" desc="Manage your category">
                <Button kind="ghost" height="60px" to="/manage/add-category">
                    Create category
                </Button>
            </DashboardHeading>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList.length > 0 &&
                        categoryList.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <span className="italic text-gray-400">{category.slug}</span>
                                </td>
                                <td>
                                    {category.status === categoryStatus.APPROVED && (
                                        <LabelStatus type="success">Approved</LabelStatus>
                                    )}
                                    {category.status === categoryStatus.REJECTED && (
                                        <LabelStatus type="success">Rejected</LabelStatus>
                                    )}
                                </td>
                                <td>
                                    <div className="flex items-center gap-x-3">
                                        <ActionView></ActionView>
                                        <ActionEdit></ActionEdit>
                                        <ActionDelete
                                            onClick={() => {
                                                handleDeleteCategory(category.id);
                                            }}
                                        ></ActionDelete>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CategoryManage;
