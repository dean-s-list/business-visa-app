import { toast, Toaster } from "react-hot-toast";
import { FcInfo } from "react-icons/fc";

function ToastNotification() {
    return <Toaster position="top-center" />;
}

type ToastOptions = {
    id: string;
    message: string;
    duration?: number;
};

const showSuccessToast = (toastOptions: ToastOptions) => {
    return toast.success(toastOptions.message, toastOptions);
};

const showInfoToast = (toastOptions: ToastOptions) => {
    return toast(toastOptions.message, {
        ...toastOptions,
        icon: <FcInfo />,
    });
};

const showErrorToast = (toastOptions: ToastOptions) => {
    return toast.error(toastOptions.message, toastOptions);
};

const showLoadingToast = (toastOptions: ToastOptions) => {
    return toast.loading(toastOptions.message, toastOptions);
};

export { showSuccessToast, showInfoToast, showErrorToast, showLoadingToast };

export default ToastNotification;
