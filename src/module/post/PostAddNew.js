import useFirebaseImage from 'hooks/useFirebaseImage';
import Toggle from 'components/toggle/Toggle';
import slugify from 'slugify';
import React, { useEffect, useState } from 'react';
import ImageUpload from 'components/image/ImageUpload';
import { useForm } from 'react-hook-form';
import { useAuth } from 'contexts/auth-context';
import { toast } from 'react-toastify';
import { Radio } from 'components/checkbox';
import { postStatus } from 'utils/constants';
import { Label } from 'components/label';
import { Input } from 'components/input';
import { Field, FieldCheckboxes } from 'components/field';
import { Dropdown } from 'components/dropdown';
import { db } from 'firebase-app/firebase-config';
import { Button } from 'components/button';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import DashboardHeading from 'module/dashboard/DashboardHeading';

const PostAddNew = () => {
    const { userInfo } = useAuth();
    const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            slug: '',
            status: 2,
            categoryId: '',
            feature: false,
            image: '',
        },
    });
    const watchStatus = watch('status');
    const watchFeature = watch('feature');
    const { image, handleResetUpload, progress, handleSelectImage, handleDeleteImage } = useFirebaseImage(
        setValue,
        getValues,
    );
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const addPostHandler = async (values) => {
        setLoading(true);
        try {
            const cloneValues = { ...values };
            cloneValues.slug = slugify(values.slug || values.title, { lower: true });
            cloneValues.status = Number(values.status);
            const colRef = collection(db, 'posts');
            await addDoc(colRef, {
                ...cloneValues,
                image,
                userId: userInfo.uid,
                createdAt: serverTimestamp(),
            });
            toast.success('Create new post successfully!');
            reset({
                title: '',
                slug: '',
                status: 2,
                categoryId: '',
                feature: false,
                image: '',
            });
            handleResetUpload();
            setSelectCategory({});
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function getData() {
            const colRef = collection(db, 'categories');
            const q = query(colRef, where('status', '==', 1));
            const querySnapshot = await getDocs(q);
            let result = [];
            querySnapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategories(result);
        }
        getData();
    }, []);

    useEffect(() => {
        document.title = 'Monkey Blog - Add new post';
    }, []);

    const handleClickOption = (item) => {
        setValue('categoryId', item.id);
        setSelectCategory(item);
    };

    return (
        <>
            <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
            <form onSubmit={handleSubmit(addPostHandler)}>
                <div className="form-layout">
                    <Field>
                        <Label>Title</Label>
                        <Input control={control} placeholder="Enter your title" name="title" required></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input control={control} placeholder="Enter your slug" name="slug"></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Image</Label>
                        <ImageUpload
                            onChange={handleSelectImage}
                            handleDeleteImage={handleDeleteImage}
                            className="h-[250px] border-solid border-2 border-[#1DC071]"
                            progress={progress}
                            image={image}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Dropdown.Select placeholder="Select the category"></Dropdown.Select>
                            <Dropdown.List>
                                {categories.length > 0 &&
                                    categories.map((item) => (
                                        <Dropdown.Option key={item.id} onClick={() => handleClickOption(item)}>
                                            {item.name}
                                        </Dropdown.Option>
                                    ))}
                            </Dropdown.List>
                        </Dropdown>
                        {selectCategory?.name && (
                            <span className="inline-block p-3 rounded-lg text-sm text-green-600 font-medium">
                                {selectCategory?.name}
                            </span>
                        )}
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle on={watchFeature === true} onClick={() => setValue('feature', !watchFeature)}></Toggle>
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.APPROVED}
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.PENDING}
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.REJECTED}
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button type="submit" className="mx-auto w-[250px]" isLoading={loading} disabled={loading}>
                    Add new post
                </Button>
            </form>
        </>
    );
};

export default PostAddNew;
