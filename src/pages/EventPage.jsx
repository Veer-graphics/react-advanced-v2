import React, { useEffect, useState } from 'react';
import {
  Heading,
  Box,
  useToast,
  Container,
  SimpleGrid,
  Image,
  Spinner,
  Text,
  Flex,
  Tag,
  Button
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, editEvent, getCategories, getEventById, getUsers } from '../api';
import { EditEventModal } from '../components/EditEventModal';
import { DeleteEventModal } from '../components/DeleteEventModal';


export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, userData, categoryData] = await Promise.all([
          getEventById(eventId),
          getUsers(),
          getCategories()
        ]);
        setEvent(eventData);
        setUsers(userData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast({
          title: 'Error',
          description: 'Could not load event data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, toast]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading>Event not found</Heading>
      </Box>
    );
  }

  const author = users.find((user) => user.id === event.createdBy) || {};
  const eventCategories = categories.filter(category => event.categoryIds?.includes(category.id));
  console.log("Author Image:", author);

  const handleEdit = async (updatedEvent) => {
    try {
      const res = await editEvent(updatedEvent.id, updatedEvent);
      setEvent(res);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: null
      });
    } finally {
      setIsEditOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: null
      });
    }
  };

  return (
    <Box paddingY={{ base: "4em", lg: "6.2em" }} pos="relative">
      <Container maxW={{ base: "90%", lg: "1300px" }}>
        <Button onClick={() => navigate("/")}>Go back</Button>
        <SimpleGrid columns={{ base: 1, lg: 2 }} mt="1em" gap={{ base: 5, lg: 10 }}>
          <Box overflow="hidden" borderRadius="md" height={{ base: "10em", lg: "30em" }}>
            <Image src={event.image} w="100%" h="100%" objectFit="cover" />
          </Box>
          <Box>
            <Box mb={2}>
              <Heading>{event.title}</Heading>
              <Text>{event.description}</Text>
            </Box>
            <Box mb={5}>
              <Flex wrap="wrap" gap={5}>
                {eventCategories.map((category) => (
                  <Tag key={`${category.id}-${event.id}`} bgColor="#f1e8ff" color="#813ede" padding={2}>
                    {category.name}
                  </Tag>
                ))}
              </Flex>
            </Box>
            <Box mb={5}>
              <Flex alignItems="center" gap={5}>
                <Box overflow="hidden" borderRadius="50%" width="50px" height="50px">
                  <Image src={author.image} />
                </Box>
                <Box>
                  <Text>{author.name}</Text>
                </Box>
              </Flex>
            </Box>
            <Flex gap={{ base: 5, lg: 3 }} direction={{ base: "column", lg: "row" }}>
              <Button
                onClick={() => setIsEditOpen(true)}
                bgGradient="linear(60deg, #813ede, #23ebc0)"
                _hover={{ transform: "scale(1.1)" }}
                color="#fff"
              >Edit
              </Button>
              <Button
                onClick={() => setIsDeleteOpen(true)}
                backgroundColor="transparent"
                border="1px solid #ff7878"
                color="#ff7878"
                _hover={{ "bgColor": "#ff7878", "color": "#fff" }}
              >Delete
              </Button>
            </Flex>
          </Box>
        </SimpleGrid>
      </Container>
      <EditEventModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} event={event} categories={categories} onEditEvent={handleEdit} />
      <DeleteEventModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} event={event} onDeleteEvent={handleDelete} />
    </Box>
  );
};
