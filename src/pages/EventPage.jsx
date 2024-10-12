import React, { useEffect, useState } from 'react';
import { Heading, Box, useToast, Container, SimpleGrid, Image, Spinner, Text, Flex, Tag, ButtonGroup, Button } from '@chakra-ui/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    const getEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        const userData = await getUsers();
        setUsers(userData);
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching event:", error);
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

    getEvent();
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
  const eventCategories = categories.filter(
    (category) => Array.isArray(event.categoryIds) && event.categoryIds.includes(category.id)
  );

  const handleEdit = async (updatedEvent) => {
    try {
      const res = await editEvent(updatedEvent.id, updatedEvent);
      setEvent(res);
      toast({
        title: "Event updated",
        description: "Event updated",
        status: "success",
        isClosable: true,
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000
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
        duration: 5000
      });
    }
  };

  return (
    <Box paddingY={{ base: "1em", lg: "6.2em" }} pos="relative">

      <Container maxW={{ base: "90%", lg: "1300px" }}>
        <Link to="/">Go back</Link>
        <SimpleGrid columns={{ base: 1, lg: 2 }} mt="1em" gap={10}>
          <Box overflow="hidden" borderRadius="md">
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
            <ButtonGroup gap={2}>
              <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
              <Button onClick={() => setIsDeleteOpen(true)}>Delete</Button>
            </ButtonGroup>
          </Box>
        </SimpleGrid>
      </Container>
      <EditEventModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} event={event} categories={categories} onEditEvent={handleEdit} />
      <DeleteEventModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} event={event} onDeleteEvent={handleDelete} />
    </Box>
  );
};
