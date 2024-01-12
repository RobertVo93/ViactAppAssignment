import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export type Severity = "error" | "success" | "warning";
type Props = {
    severity?: Severity;
    message: string;
    onClose: () => void;
    isOpen?: boolean;
}

export const AlertSnackbars = ({
    severity,
    message,
    onClose,
}: Props) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    const renderAlert = (message: string, severity?: Severity) => {
        switch (severity) {
            case "error":
                return <Alert onClose={handleClose} severity="error">{message}</Alert>
            case "success":
                return <Alert onClose={handleClose} severity="error">{message}</Alert>
            case "warning":
                return <Alert onClose={handleClose} severity="error">{message}</Alert>
            default:
                return <></>
        }
    }

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            {renderAlert(message, severity)}
        </Snackbar>
    );
}