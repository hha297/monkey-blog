import { Button } from 'components/button';
import { Radio } from 'components/checkbox';
import { Field, FieldCheckboxes } from 'components/field';
import { Label } from 'components/label';
import { db } from 'firebase-app/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';
import { Input } from 'components/input';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoryStatus } from 'utils/constants';
import { update } from 'lodash';
import slugify from 'slugify';
import { toast } from 'react-toastify';
const CategoryUpdate = () => {
    const {
        control,
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {},
    });
    const [params] = useSearchParams();
    const categoryId = params.get('id');
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, 'categories', categoryId);
            const singleDoc = await getDoc(colRef);
            reset(singleDoc.data());
        }
        fetchData();
    }, [categoryId, reset]);
    const watchStatus = watch('status');
    const handleUpdateCategory = async (values) => {
        const colRef = doc(db, 'categories', categoryId);
        await updateDoc(colRef, {
            name: values.name,
            slug: slugify(values.slug || values.title, { lower: true }),
            status: Number(values.status),
        });
        toast.success('Update category successfully');
        navigate('/manage/category');
    };

    if (!categoryId) return null;
    return (
        <div>
            <DashboardHeading
                title="Update category"
                desc={`Update category with ID: ${categoryId}`}
            ></DashboardHeading>

            <form onSubmit={handleSubmit(handleUpdateCategory)}>
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input control={control} name="name" placeholder="Enter your category name" required></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input control={control} name="slug" placeholder="Enter your slug"></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === categoryStatus.APPROVED}
                                value={categoryStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === categoryStatus.REJECTED}
                                value={categoryStatus.REJECTED}
                            >
                                Rejected
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    className="mx-auto w-[240px]"
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Update new category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;
