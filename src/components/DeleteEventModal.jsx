import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Text, Button, Flex } from "@chakra-ui/react"
import { useState } from "react";

export const DeleteEventModal = ({ isOpen, onClose, event, onDeleteEvent }) => {
    // const [message, setMessage] = useState(null);

    const handleDeleteEvent = () => {
        if (event) {
            onDeleteEvent(event.id);
            onClose();
            // setMessage({ text: `The event "${event.title}" has been successfully deleted.`, type: "success" });
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalBody>
                    {event ? (
                        <Text>Are you sure you want to delete the event "{event.title}"?</Text>
                    ) : (
                        <Text>No event selected</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Flex w="100%" gap={4} direction={{ base: "column", lg: "row" }}>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={handleDeleteEvent}
                            isDisabled={!event} // Disable button if event is not defined
                        >
                            Delete
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

}