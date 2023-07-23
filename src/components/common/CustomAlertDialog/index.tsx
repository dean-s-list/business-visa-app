import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import React from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    body: string;
    actionText?: string;
    actionFn: () => void;
    type: "danger" | "success";
}

export default function CustomAlertDialog({
    title,
    body,
    isOpen,
    onClose,
    actionText = "Delete",
    actionFn,
    type,
}: Props) {
    const cancelRef = React.useRef(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent bg="gray.800" color="gray.50">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>{body}</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme={type === "danger" ? "red" : "green"}
                            onClick={() => {
                                actionFn();
                                onClose();
                            }}
                            ml={3}
                        >
                            {actionText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
