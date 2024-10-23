import { useToast, Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Text, Button, Flex } from "@chakra-ui/react"

export const DeleteEventModal = ({ isOpen, onClose, event, onDeleteEvent }) => {
    const toast = useToast();

    const handleDeleteEvent = () => {
        if (event) {
            onDeleteEvent(event.id);
            onClose();
            toast({
                title: 'Event deleted',
                description: `The event "${event.title}" has been successfully deleted.`,
                status: 'success',
                duration: null,
                isClosable: true,
            });

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