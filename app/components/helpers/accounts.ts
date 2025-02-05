export const validateFormComplete = (firstName: string, email: string, password: string, confirmPassword: string) => {
	if (!firstName || !email || !password || !confirmPassword) {
		return false;
	}
	return true;
}

export const validateEmail = (email: unknown): email is string => {
	return (
		typeof email === 'string' &&
		email.length >= 6 &&
		email.length <= 31 &&
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
	);
}

export const validatePassword = (password: unknown): password is string => {
	return typeof password === 'string' && password.length >= 8 && password.length <= 255;
}
