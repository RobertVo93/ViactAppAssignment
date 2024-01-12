import { Severity } from "@/components/Snackbar";
import { axiosInstance, config } from "@/config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Cookies from "js-cookie";

export const useLoggedInUserInfo = () => {
    const [email, setUserEmail] = useState("");
    const [message, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<Severity | undefined>(undefined);

    useEffect(() => {
        renderLoggedInUserInfo();
    }, []);

    const renderLoggedInUserInfo = async () => {
        try {
            const loggedInUser = await axiosInstance.get("/auth");
            if (loggedInUser?.data?.email) {
                setUserEmail(loggedInUser.data.email);
            }
        }
        catch (error: any) {
            setSeverity("error");
            setMessage(error?.response?.data?.message)
        }
    }

    return {
        email,
        message,
        severity,
        setMessage,
    }
}