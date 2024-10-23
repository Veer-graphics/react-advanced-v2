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
          description: `We encountered an issue while fetching data. Please check your internet connection or contact support if the problem persists. Error: ${error.message}`,
          status: 'error',
          duration: null, // This makes the toast stay visible until manually dismissed
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

    if (filtered.length === 0 && searchQuery) {
      toast({
        title: 'No events found.',
        description: 'No events match your search criteria.',
        status: 'error',
        duration: null, // Keeps the toast visible until manually dismissed
        isClosable: true,
      })
    }
  }, [events, selectedCategories, searchQuery, toast]);

  // Add new event
  const onAddEvent = async (newEvent) => {
    try {
      const addedEvent = await addEvent(newEvent);
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
    } catch (error) {
      toast({
        title: 'Error adding event.',
        description: `We encountered an issue while adding the event. Please try again. Error: ${error.message}`,
        status: 'error',
        duration: null, // This makes the error toast stay until manually dismissed
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
        <Container maxW={{ base: "90%", lg: "1300px" }} paddingY={{ base: "3em", lg: "0em" }}>
          <Heading color={"blue.800"} mb={5}>
            Your Events
          </Heading>
          <Input
            placeholder="Search your event by name"
            bgColor={"white"}
            boxShadow={"sm"}
            color={"blue.900"}
            focusBorderColor="blue.100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width={"30%"}
            mb={4}
            w="100%"
          />
          <Button
            bgGradient="linear(60deg, #813ede, #23ebc0)"
            _hover={{ transform: "scale(1.1)" }}
            color={"white"}
            onClick={() => setIsAddOpen(true)}
            display="block"
          >
            Add Event
          </Button>

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={5}>
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
        users={users}
      />
    </Box>
  );
};
