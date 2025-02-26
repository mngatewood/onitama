"use client";
import { Label } from "./Label";
import { Input } from "./Input";
import React, { FormEvent, useEffect, useCallback, useState } from "react";
import { validateLoginFormComplete, validateEmail, validatePassword } from "../helpers/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [formValid, setFormValid] = useState<boolean>(false);
	const [formError, setFormError] = useState<string>("");

	const validateForm = useCallback(() => {
		const { email, password } = formData;

		if (!email && !password) {
			setFormError("");
			setFormValid(false);
			return false;
		}

		if (!validateLoginFormComplete(email, password)) {
			setFormError("Please fill in all the required fields");
			setFormValid(false);
			return false;
		}
		if (!validateEmail(email)) {
			setFormError("Email address is invalid");
			setFormValid(false);
			return false
		}
		if (!validatePassword(password)) {
			setFormError("Password must be at least 8 characters");
			setFormValid(false);
			return false
		}
		setFormError("");
		setFormValid(true);
		return true
	}
		, [formData]);

	useEffect(() => {
		validateForm();
	}, [validateForm, formData]);

	const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
		const { name, value } = event.target as HTMLInputElement;

		setFormData({ ...formData, [name]: value });
	};

	const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validateForm()) {
			const payload = {
				email: formData.email,
				password: formData.password,
				redirect: false
			};
			const response = await signIn('credentials', payload);
			if (response?.ok) {
				router.push("/?logged_in=true");
			} else {
				setFormError("Incorrect email or password");
				setFormValid(false);
			}
		}
	}

	return (
		<>
			<form method="post" onSubmit={submitForm} className="mt-8">
				<div className={'mb-4 flex w-full flex-col space-y-2'}>
					<Label htmlFor="email">Email Address *</Label>
					<Input
						id="email"
						name="email"
						type="email"
						role="textbox"
						autoComplete="email"
						onInput={handleInputChange}
						required
					/>
				</div>
				<div className={'mb-4 flex w-full flex-col space-y-2'}>
					<Label htmlFor="password">Password *</Label>
					<Input
						id="password"
						name="password"
						type="password"
						role="textbox"
						autoComplete="new-password"
						onInput={handleInputChange}
						required
					/>
				</div>
				<div className="mb-8">
					<span className="text-sm text-gray-500 dark:text-gray-400">* required</span>
				</div>
				<button
					className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-75"
					type="submit"
					disabled={!formValid}
				>
					Submit
					<span
						className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"
					></span>
					<span
						className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"
					></span>
				</button>
				<div className="flex justify-center items-center h-12">
					<span className="text-sm text-red-500">{formError}</span>
				</div>
			</form>
		</>
	)
}