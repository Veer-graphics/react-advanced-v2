import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Heading, Input, SimpleGrid, useToast } from '@chakra-ui/react';
import { addEvent, getCategories, getEvents, getUsers } from '../api';
import { EventItem } from '../components/EventItem';
import { AddEventModal } from '../components/AddEventModal';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const toast = useToast();

  // Fetch events, categories, and users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData, usersData] = await Promise.all([
          getEvents(),
          getCategories(),
          getUsers(),
        ]);
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setCategories(categoriesData);
        setUsers(usersData);
      } catch (error) {
        toast({
          title: 'Error fetching data.',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  // Handle category filter selection
  const handleFilterClick = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updatedCategories);
  };

  // Filter events based on selected categories and search term
  const filterEvents = () => {
    let updatedEvents = events;

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      updatedEvents = updatedEvents.filter((event) =>
        event.categoryIds && // Check if categoryIds is defined
        selectedCategories.some((categoryId) => event.categoryIds.includes(categoryId))
      );
    }

    // Filter by search term
    if (searchQuery) {
      updatedEvents = updatedEvents.filter((event) =>
        event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase()) // Check if event.title exists
      );
    }

    return updatedEvents;
  };

  useEffect(() => {
    const filtered = filterEvents();
    setFilteredEvents(filtered);
  }, [events, selectedCategories, searchQuery]);

  // Add new event
  const onAddEvent = async (newEvent) => {
    try {
      const addedEvent = await addEvent(newEvent);
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      toast({
        title: 'Event added.',
        description: 'The new event has been successfully added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding event.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pos={"relative"}>
      {/* Header */}
      <Box
        w={"100%"}
        bgGradient="linear(to-b, #e3f9ff, rgba(35, 235, 192, 0))"
        minH={{ base: "30vh", lg: "50vh" }}
        paddingY={{ base: "1em", lg: "6.2em" }}
      >
        <Container maxW={{ base: "90%", lg: "1300px" }}>
          <Heading color={"blue.800"} mb={5}>
            Your Events
          </Heading>
          <Flex gap={5}>
            <Input
              placeholder="Search your event by name"
              bgColor={"white"}
              boxShadow={"sm"}
              color={"blue.900"}
              focusBorderColor="blue.100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              width={"30%"}
            />
            <Button
              bgGradient="linear(60deg, #813ede, #23ebc0)"
              _hover={{ transform: "scale(1.1)" }}
              color={"white"}
              onClick={() => setIsAddOpen(true)}
            >
              Add Event
            </Button>
          </Flex>

          {/* Categories as filter buttons */}
          <Flex gap={3} mt={5}>
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
          </Flex>
        </Container>
      </Box>

      {/* Display filtered events */}
      <Box
        pos={{ base: "relative", lg: "absolute" }}
        width={{ base: "90%", lg: "1300px" }}
        bgColor={"white"}
        boxShadow="xl"
        borderRadius="md"
        padding={5}
        paddingBottom={"50px"}
        top="80%"
        left="50%"
        transform="translateX(-50%)"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <SimpleGrid columns={{ base: 1, lg: 4 }} gap={5}>
          {filteredEvents.map((event) => (
            <EventItem key={event.id} event={event} categories={categories} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddEvent={onAddEvent}
        categories={categories}
      />
    </Box>
  );
};
