import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useToast,
    Box,
    Image
} from "@chakra-ui/react";
import { useState } from "react";

export const AddEventModal = ({ isOpen, onClose, onAddEvent, categories }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [eventImage, setEventImage] = useState(null);
    const [eventImagePreview, setEventImagePreview] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [authorName, setAuthorName] = useState("");

    const toast = useToast();

    const handleFilterClick = (categoryId) => {
        const updatedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId)
            : [...selectedCategories, categoryId];
        setSelectedCategories(updatedCategories);
    };

    const addEvent = () => {

        if (!title || !description || !eventImage) {
            alert('Please fill all fields and upload an image.');
            return;
        }

        const newEvent = {
            id: Date.now(), // Example unique ID
            title,
            description,
            image: eventImagePreview,
            authorName,
            startTime,
            endTime,
            categoryIds: selectedCategories// Use preview URL to display the image
            // Include other event properties like startTime, endTime, categories, etc.
        };

        onAddEvent(newEvent);

        toast({
            title: 'Event added.',
            description: `${title} has been added successfully!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
        });

        // Reset fields and close modal
        setTitle('');
        setDescription('');
        setEventImage(null);
        setEventImagePreview(null);
        setAuthorName("");
        onClose();
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEventImage(file);
            setEventImagePreview(URL.createObjectURL(file))
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input
                            placeholder="Your event name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Your event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Categories</FormLabel>
                        <HStack wrap="wrap" gap={4}>
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
                    <FormControl>
                        <FormLabel>Add your start time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Add your end time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Add your name</FormLabel>
                        <Input
                            placeholder="Your name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="image" mt={4} isRequired>
                        <FormLabel>Upload Image</FormLabel>
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
                        bgGradient="linear(60deg, #813ede, #23ebc0)"
                        _hover={{ transform: "scale(1.1)" }}
                        color={"white"}
                        onClick={addEvent}
                        isDisabled={!title || !description || selectedCategories.length === 0} // Disable if fields are empty
                    >
                        Add event
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
