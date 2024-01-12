"use client"

import {
	Box,
} from "@mui/material";
import { AlertSnackbars } from "../Snackbar";
import { useLoggedInUserInfo } from "./hook/useLoggedInUserInfo";

export const LoggedInUserInfo = () => {
	const {
		message,
		severity,
		email,
		setMessage,
	} = useLoggedInUserInfo();
	return (
		<Box>
			{email && (<>Welcome {email}</>)}
			{
				!!message && (<AlertSnackbars onClose={() => setMessage("")} message={message} severity={severity} />)
			}
		</Box>
	);
};
