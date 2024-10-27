// AddEventModal.jsx
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
    Box,
    Image,
    Select
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddEventModal = ({ isOpen, onClose, onAddEvent, categories, users }) => {
    const [addFormData, setAddFormData] = useState({
        title: "",
        description: "",
        selectedCategories: [],
        image: null,
        eventImagePreview: null,
        startTime: "",
        endTime: "",
        selectedUserId: null, // Initialize as null
    });


    const navigate = useNavigate();

    const handleFilterClick = (categoryId) => {
        setAddFormData((prevData) => ({
            ...prevData,
            selectedCategories: prevData.selectedCategories.includes(categoryId)
                ? prevData.selectedCategories.filter((id) => id !== categoryId)
                : [...prevData.selectedCategories, categoryId]
        }));
    };

    const addEvent = async () => {
        const { title, description, eventImagePreview, selectedUserId, startTime, endTime, selectedCategories } = addFormData;

        if (!title || !description || !eventImagePreview || selectedUserId === null || !startTime || !endTime) {
            // setMessage({ text: "Please fill all fields and upload an image", type: "error" });
            // return;
            return;
        }

        const newEvent = {
            id: Date.now(), // Unique ID can be improved
            title,
            description,
            image: eventImagePreview,
            createdBy: selectedUserId,
            startTime,
            endTime,
            categoryIds: selectedCategories,
        };

        try {
            await onAddEvent(newEvent); // Ensure this is an async function
            // setMessage({ text: `${title} has been added successfully!`, type: "success" });

            // Reset fields and close modal
            setAddFormData({
                title: "",
                description: "",
                selectedCategories: [],
                image: null,
                eventImagePreview: null,
                startTime: "",
                endTime: "",
                selectedUserId: null, // Reset to null
            });

            navigate(`/event/${newEvent.id}`, { state: { message: `${title} has been added successfully!`, type: "success" } });
            onClose();
        } catch (error) {
            setMessage({ text: "Failed to add event. Please try again.", type: "error" });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAddFormData((prevData) => ({
                ...prevData,
                image: file,
                eventImagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const { title, description, eventImagePreview, startTime, endTime, selectedCategories, selectedUserId } = addFormData;

    // Find the selected user based on the selectedUserId
    const selectedUser = users.find(user => user.id === selectedUserId) || {};

    return (
        <Modal isOpen={isOpen} onClose={() => {
            setAddFormData({
                title: "",
                description: "",
                selectedCategories: [],
                image: null,
                eventImagePreview: null,
                startTime: "",
                endTime: "",
                selectedUserId: null, // Reset to null
            });
            onClose();
        }}>
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
                            onChange={(e) => setAddFormData((prevData) => ({ ...prevData, title: e.target.value }))}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Your event description"
                            value={description}
                            onChange={(e) => setAddFormData((prevData) => ({ ...prevData, description: e.target.value }))}
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
                            onChange={(e) => setAddFormData((prevData) => ({ ...prevData, startTime: e.target.value }))}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Add your end time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setAddFormData((prevData) => ({ ...prevData, endTime: e.target.value }))}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Select Author</FormLabel>
                        <Select
                            placeholder="Select author"
                            value={selectedUserId ?? ""} // Ensure value is a string or empty string
                            onChange={(e) => setAddFormData((prevData) => ({ ...prevData, selectedUserId: Number(e.target.value) }))}
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedUser.image && (
                        <Box mt={4} display="flex" alignItems="center">
                            <Image src={selectedUser.image} alt={`${selectedUser.name}'s image`} boxSize="50px" borderRadius="full" />
                            <Box ml={2}>
                                <strong>{selectedUser.name}</strong>
                            </Box>
                        </Box>
                    )}
                    <FormControl id="image" mt={4} isRequired>
                        <FormLabel>Upload Event Image</FormLabel>
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                        {eventImagePreview && (
                            <Box mt={2}>
                                <Image src={eventImagePreview} alt="Selected image" boxSize="150px" objectFit="cover" />
                            </Box>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter w="100%">
                    <Button
                        w="100%"
                        bgGradient="linear(60deg, #813ede, #23ebc0)"
                        _hover={{ transform: "scale(1.1)" }}
                        color={"white"}
                        onClick={addEvent}
                        isDisabled={!title || !description || !eventImagePreview || selectedUserId === null || !startTime || !endTime}
                    >
                        Add Event
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
