import { Severity } from "@/components/Snackbar";
import { axiosInstance, config } from "@/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Cookies from "js-cookie";

export type LoginFormInput = {
	email: string;
	password: string;
}

export const useLoginForm = () => {
	const router = useRouter();

	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [message, setMessage] = useState<string>("");
	const [severity, setSeverity] = useState<Severity | undefined>(undefined);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInput>({
		resolver: yupResolver(
			yup.object({
				email: yup.string()
					.email("Wrong email format")
					.required("Email is mandatory"),
				password: yup.string()
					.required("Password is mandatory"),
			})
		)
	});

	const onSubmit = async (values: LoginFormInput) => {
		const { email, password } = values;
		try {
			const loggedUser = await axiosInstance.post("/auth/login", {
				email,
				password,
			});
			Cookies.set(config.COOKIES.ACCESS_TOKEN, loggedUser?.data?.accessToken);
			router.push("/success");
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