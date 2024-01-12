"use client"

import {
	PeopleAlt,
	VisibilityOffTwoTone,
	VisibilityTwoTone
} from "@mui/icons-material"
import {
	Avatar,
	Box,
	Button,
	Card,
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
} from "@mui/material";
import { useLoginForm } from "./hooks/useLoginForm";
import { authFormStyles } from "@/style";
import { AlertSnackbars } from "../Snackbar";

export const LoginForm = () => {
	const {
		hidePassword,
		errors,
		message,
		severity,
		setHidePassword,
		handleSubmit,
		onSubmit,
		register,
		setMessage,
	} = useLoginForm();

	return (
		<Box sx={authFormStyles.container}>
			<Card sx={authFormStyles.card}>
				<Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
					<Avatar sx={authFormStyles.avatar}>
						<PeopleAlt sx={authFormStyles.icon} />
					</Avatar>
				</Box>
				<form
					style={authFormStyles.form}
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormControl error={!!errors.email} id="email" fullWidth margin="normal">
						<InputLabel htmlFor="email">
							e-mail
						</InputLabel>
						<Input
							type="email"
							autoComplete="email"
							{...register("email")}
						/>
						<Box color={"red"}>
							{errors?.email?.message}
						</Box>
					</FormControl>

					<FormControl error={!!errors.password} id="password" fullWidth margin="normal">
						<InputLabel htmlFor="password">
							password
						</InputLabel>
						<Input
							autoComplete="password"
							type={hidePassword ? "password" : "input"}
							endAdornment={
								hidePassword ? (
									<InputAdornment position="end">
										<VisibilityOffTwoTone
											sx={authFormStyles.passwordEye}
											onClick={() => setHidePassword(false)}
										/>
									</InputAdornment>
								) : (
									<InputAdornment position="end">
										<VisibilityTwoTone
											sx={authFormStyles.passwordEye}
											onClick={() => setHidePassword(true)}
										/>
									</InputAdornment>
								)
							}
							{...register("password")}
						/>
						<Box color={"red"}>
							{errors?.password?.message}
						</Box>
					</FormControl>
					<Button
						disableRipple
						fullWidth
						variant="contained"
						type="submit"
						sx={{
							marginTop: 5
						}}
					>
						Login
					</Button>
				</form>
			</Card>
			{
				!!message && (<AlertSnackbars onClose={() => setMessage("")} message={message} severity={severity} />)
			}
		</Box>
	);
};
