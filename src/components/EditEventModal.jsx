import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalBody, FormControl, FormLabel, Input, Textarea, HStack, Button, ModalFooter } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

export const EditEventModal = ({ isOpen, onClose, event, categories, onEditEvent }) => {

    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const [selectedCategories, setSelectedCategories] = useState(event?.categoryIds || []); // Store multiple categories
    const toast = useToast();


    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setSelectedCategories(event.categoryIds || []); // Set initial selected categories
        }
    }, [event]);


    const handleEditEvent = () => {
        if (title && description && selectedCategories.length > 0) {
            onEditEvent({ ...event, title, description, categoryIds: selectedCategories });
            onClose();
            toast({
                title: 'Event updated',
                description: `The event "${title}" has been successfully updated.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all the required fields.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };


    const handleFilterClick = (categoryId) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId) // Remove if already selected
                : [...prevSelected, categoryId] // Add if not selected
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>


                    {/* Filter Buttons for Selecting Multiple Categories */}
                    <FormControl mt={4} isRequired>
                        <FormLabel>Categories</FormLabel>
                        <HStack spacing={2} wrap="wrap">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategories.includes(category.id) ? 'solid' : 'outline'}
                                    colorScheme={selectedCategories.includes(category.id) ? 'white' : '#813ede'}
                                    bg={selectedCategories.includes(category.id) ? '#813ede' : 'transparent'}
                                    color={selectedCategories.includes(category.id) ? 'white' : '#813ede'}
                                    onClick={() => handleFilterClick(category.id)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </HStack>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button bgGradient="linear(60deg, #813ede, #23ebc0)"
                        _hover={{ transform: "scale(1.1)" }}
                        color={"white"}
                        onClick={handleEditEvent}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}