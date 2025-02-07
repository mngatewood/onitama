export const validateRegisterFormComplete = (firstName: string, email: string, password: string, confirmPassword: string) => {
	if (!firstName || !email || !password || !confirmPassword) {
		return false;
	}
	return true;
}

export const validateLoginFormComplete = (email: string, password: string) => {
	if (!email || !password) {
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

export const validateFormData = (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
	if (!firstName && !lastName && !email && !password && !confirmPassword) {
		return false;
	} else if (!validateRegisterFormComplete(firstName, email, password, confirmPassword)) {
		return false;
	} else if (!validateEmail(email)) {
		return false
	} else if (!validatePassword(password)) {
		return false
	} else if (password !== confirmPassword) {
		return false
	} else {
		return true
	}
}

