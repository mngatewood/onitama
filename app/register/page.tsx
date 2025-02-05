"use client";
import React, { FormEvent, useEffect, useCallback } from "react";
import { useState } from "react";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { DarkModeToggle } from "../components/DarkThemeToggle";
import Link from "next/link";
import { validateFormComplete, validateEmail, validatePassword } from "../components/helpers/accounts";

const Register = () => {

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [formValid, setFormValid] = useState<boolean>(false);
	const [formError, setFormError] = useState<string>("");

	const validateForm = useCallback(() => {
		const { firstName, lastName, email, password, confirmPassword } = formData;

		if (!firstName && !lastName && !email && !password && !confirmPassword) {
			setFormError("");
			setFormValid(false);
			return false;
		}

		if (!validateFormComplete(firstName, email, password, confirmPassword)) {
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
		if (password !== confirmPassword) {
			setFormError("Passwords do not match");
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

	const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (validateForm()) {
			console.log("Form submitted");
			console.log(formData);
		}
	}

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden flex justify-center items-center">
			<div
				className="mx-auto w-full max-w-md rounded-none border border-gray-300 bg-amber-50 p-4 shadow-lg shadow-slate-500 dark:shadow-slate-800 dark:border-gray-800 dark:bg-black md:rounded-2xl md:p-8 h-[600px]"
			>
				<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to Onitama</h2>
				<p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
					Fill out the form below to create your account
				</p>
				<form method="post" action="/register" onSubmit={submitForm} className="my-8">
					<div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
						<div className={'flex w-full flex-col space-y-2'}>
							<Label htmlFor="firstName">* First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								type="text"
								role="textbox"
								autoComplete="given-name"
								onInput={handleInputChange}
								required
							/>
						</div>
						<div className={'flex w-full flex-col space-y-2'}>
							<Label htmlFor="lastName">Last Name</Label>
							<Input id="lastName"
								name="lastName"
								type="text"
								role="textbox"
								autoComplete="family-name"
								onInput={handleInputChange}
							/>
						</div>
					</div>
					<div className={'mb-4 flex w-full flex-col space-y-2'}>
						<Label htmlFor="email">* Email Address</Label>
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
						<Label htmlFor="password">* Password</Label>
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
					<div className={'mb-8 flex w-full flex-col space-y-2'}>
						<Label htmlFor="confirmPassword">* Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							role="textbox"
							autoComplete="new-password"
							onInput={handleInputChange}
							required
						/>
					</div>

					<button
						className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-500 to-neutral-400 font-medium hover:bg-gradient-to-br hover:from-neutral-600 hover:to-neutral-400 text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:hover:bg-white dark:hover:from-zinc-800 dark:hover:to-zinc-700 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:pointer-events-none disabled:opacity-50"
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
					<div className="flex space-x-2 h-24 relative">
						<div className="flex items-center justify-center my-2 h-14">
							<span className="text-sm text-red-500">{formError}</span>
						</div>
						<span className="text-sm text-gray-500 dark:text-gray-400 absolute bottom-2">* required</span>
					</div>
				</form>
			</div>
			<DarkModeToggle />
			<footer className="container absolute bottom-0 w-full h-14 p-4 flex justify-center gap-4 text-sky-700 dark:text-sky-300">
				<button className="w-1/3"><Link href="/">Cancel</Link></button>
			</footer>

		</div>
	);
}

export default Register;