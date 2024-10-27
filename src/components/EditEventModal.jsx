import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    HStack,
    Button,
    ModalFooter,
    Box,
    Image,
    Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export const EditEventModal = ({ isOpen, onClose, event, categories, onEditEvent }) => {
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        selectedCategories: [],
        eventImagePreview: '',
        startTime: '',
        endTime: '',
        image: null,
    });
    // const [message, setMessage] = useState(null);

    useEffect(() => {
        if (event) {
            setEditFormData({
                title: event.title,
                description: event.description,
                selectedCategories: event.categoryIds || [],
                eventImagePreview: event.image,
                startTime: event.startTime,
                endTime: event.endTime,
                image: null, // Reset image state to avoid confusion
            });
        }
    }, [event]);

    const handleEditEvent = async () => {
        const { title, description, selectedCategories, eventImagePreview, startTime, endTime } = editFormData;

        if (title && description && selectedCategories.length > 0 && startTime && endTime) {
            await onEditEvent({
                ...event,
                title,
                description,
                categoryIds: selectedCategories,
                image: eventImagePreview, // Use updated image path or keep it as is if not changed
                startTime,
                endTime,
            });
            onClose();
            // setMessage({ text: `The event "${title}" has been successfully updated.`, type: "success" });
        } else {
            // setMessage({ text: "Please fill in all the required fields.", type: "error" })
        }
    };

    const handleFilterClick = (categoryId) => {
        setEditFormData((prevData) => ({
            ...prevData,
            selectedCategories: prevData.selectedCategories.includes(categoryId)
                ? prevData.selectedCategories.filter((id) => id !== categoryId) // Remove if already selected
                : [...prevData.selectedCategories, categoryId], // Add if not selected
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditFormData((prevData) => ({
                ...prevData,
                image: file,
                eventImagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const { title, description, eventImagePreview, startTime, endTime, selectedCategories } = editFormData;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input
                            value={title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>Start Time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                        />
                    </FormControl>
                    <FormControl mt={4} isRequired>
                        <FormLabel>End Time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
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
                    <FormControl id="image" mt={4}>
                        <FormLabel>Upload Event Image</FormLabel>
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                        {eventImagePreview && (
                            <Box mt={2}>
                                <Image src={eventImagePreview} alt="Selected image" boxSize="150px" objectFit="cover" />
                            </Box>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        w="100%"
                        bgGradient="linear(60deg, #813ede, #23ebc0)"
                        _hover={{ transform: "scale(1.1)" }}
                        color={"white"}
                        onClick={handleEditEvent}
                        isDisabled={!title || !description || selectedCategories.length === 0 || !startTime || !endTime}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
