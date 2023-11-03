import slugify from 'slugify';
import React, { useEffect } from 'react';
import InputPasswordToggle from 'components/input/InputPasswordToggle';
import AuthenticationPage from './AuthenticationPage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { Label } from 'components/label';
import { Input } from 'components/input';
import { Field } from 'components/field';
import {
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { Button } from 'components/button';
import { auth, db } from 'firebase-app/firebase-config';
import { userRole, userStatus } from 'utils/constants';

const schema = yup.object({
    fullname: yup
        .string()
        .required('Please enter your fullname'),
    email: yup
        .string()
        .email('Please enter valid email address')
        .required('Please enter your email address'),
    password: yup
        .string()
        .min(
            8,
            'Your password must be at least 8 characters or greater',
        )
        .required('Please enter your password'),
});

const SignUpPage = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const handleSignUp = async (values) => {
        if (!isValid) return;
        await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password,
        );
        await updateProfile(auth.currentUser, {
            displayName: values.fullname,
            photoURL:
                'https://scontent.fqlf1-2.fna.fbcdn.net/v/t39.30808-6/325784857_690291016086296_6871624399450856440_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=MnuE8-5mjhsAX8bRhmD&_nc_oc=AQlpPC9xcgNNrUZl9tsgwWxSnXrQtiTpDMRyQzO2K6eDOLayynLuT33VpwsVoiyC9C4&_nc_ht=scontent.fqlf1-2.fna&oh=00_AfCwWxVp1qqYZ6bvCYROEy64rB20jmlJrYnqXsAgkC8Ybw&oe=6549CDB4',
        });

        await setDoc(
            doc(db, 'users', auth.currentUser.uid),
            {
                fullname: values.fullname,
                email: values.email,
                password: values.password,
                username: slugify(values.fullname, {
                    lower: true,
                }),
                avatar: 'https://scontent.fqlf1-2.fna.fbcdn.net/v/t39.30808-6/325784857_690291016086296_6871624399450856440_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=MnuE8-5mjhsAX8bRhmD&_nc_oc=AQlpPC9xcgNNrUZl9tsgwWxSnXrQtiTpDMRyQzO2K6eDOLayynLuT33VpwsVoiyC9C4&_nc_ht=scontent.fqlf1-2.fna&oh=00_AfCwWxVp1qqYZ6bvCYROEy64rB20jmlJrYnqXsAgkC8Ybw&oe=6549CDB4',
                status: userStatus.ACTIVE,
                role: userRole.USER,
                createAt: serverTimestamp(),
            },
        );

        toast.success('Register successfully!!!');
        navigate('/');
    };
    useEffect(() => {
        const arrErroes = Object.values(errors);
        if (arrErroes.length > 0) {
            toast.error(arrErroes[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    useEffect(() => {
        document.title = 'Register Page';
    }, []);
    return (
        <AuthenticationPage>
            <form
                className="form"
                onSubmit={handleSubmit(handleSignUp)}
                autoComplete="off"
            >
                <Field>
                    <Label htmlFor="fullname">
                        Fullname
                    </Label>
                    <Input
                        type="text"
                        name="fullname"
                        placeholder="Enter your fullname"
                        control={control}
                    />
                </Field>
                <Field>
                    <Label htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        control={control}
                    />
                </Field>
                <Field>
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <InputPasswordToggle
                        control={control}
                    ></InputPasswordToggle>
                </Field>
                <div className="have-account">
                    You already have an account?{' '}
                    <NavLink to={'/sign-in'}>Login</NavLink>{' '}
                </div>
                <Button
                    type="submit"
                    className="w-full max-w-[300px] mx-auto"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Sign Up
                </Button>
            </form>
        </AuthenticationPage>
    );
};

export default SignUpPage;
