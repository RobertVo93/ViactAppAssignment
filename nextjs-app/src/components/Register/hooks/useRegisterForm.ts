import { Severity } from "@/components/Snackbar";
import { axiosInstance } from "@/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export type RegisterFormInput = {
	email: string;
	password: string;
	confirmPassword: string;
}

export const useRegisterForm = () => {
	const router = useRouter();

	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [message, setMessage] = useState<string>("");
	const [severity, setSeverity] = useState<Severity | undefined>(undefined);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInput>({
		resolver: yupResolver(
			yup.object({
				email: yup.string()
					.email("Wrong email format")
					.required("Email is mandatory"),
				password: yup.string()
					.required("Password is mandatory"),
				confirmPassword: yup.string()
					.required("Confirm Password is mandatory")
					.oneOf(
						[yup.ref("password")],
						"Confirm Password mismatch. Please try again."
					)
			})
		)
	});

	const onSubmit = async (values: RegisterFormInput) => {
		const { email, password } = values;
		try {
			await axiosInstance.post("/auth/register", {
				email,
				password,
			});
			router.push("/login");
		} catch (error: any) {
			setSeverity("error");
			setMessage(error?.response?.data?.message)
		}
	};
	return {
		hidePassword,
		errors,
		message,
		severity,
		setHidePassword,
		handleSubmit,
		onSubmit,
		register,
		setMessage,
	}
}