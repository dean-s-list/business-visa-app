import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    modalBody?: React.ReactNode;
    modalFooter?: React.ReactNode;
}

function CustomModal({
    isOpen,
    onClose,
    title,
    modalBody,
    modalFooter,
}: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
            <ModalOverlay zIndex={10} />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{modalBody}</ModalBody>
                <ModalFooter>{modalFooter}</ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CustomModal;
