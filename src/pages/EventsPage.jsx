import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Heading, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { addEvent, getCategories, getEvents, getUsers } from '../api';
import { EventItem } from '../components/EventItem';
import { AddEventModal } from '../components/AddEventModal';
import { useLocation } from 'react-router-dom';
import { StatusMessage } from '../components/StatusMessage';

export const EventsPage = () => {
  const { state } = useLocation();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [status, setStatus] = useState(state || { message: "", type: "" });

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
        // setStatus({ message: `Error fetching data: ${error.message}`, type: "error" });
        setStatus({ state: { message: `Error fetching data: ${error.message}`, type: "error" } })
      }
    };

    fetchData();
  }, []);

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
      // setStatus({ message: "No events match your criteria", type: "error" });
      setStatus({ state: { message: "No events match your criteria", type: "error" } })

    }
  }, [events, selectedCategories, searchQuery]);

  // Add new event
  const onAddEvent = async (newEvent) => {
    try {
      const addedEvent = await addEvent(newEvent);
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      // setStatus({ message: `Your event ${newEvent.title} has been successfully added!`, type: "success" })
      setStatus({ state: { message: `Your event ${newEvent.title} has been successfully added!`, type: "success" } })
    } catch (error) {
      // setStatus({ message: `We encountered an issue while adding the event. Please try again. Error: ${error.message}`, type: "error" });
      setStatus({ state: { message: `We encountered an issue while adding the event. Please try again. Error: ${error.message}`, type: "error" } })
    }
  };

  return (
    <Box pos={"relative"}>
      {/* Header */}
      <Box
        w={"100%"}
        bgGradient="linear(to-b, #e3f9ff, rgba(35, 235, 192, 0))"
        minH={{ base: "30vh", lg: "50vh" }}
        paddingTop={{ base: "1em", lg: "6.2em" }}
        paddingBottom={{ base: "1em", lg: "0em" }}
      >
        <Container maxW={{ base: "90%", lg: "1300px" }} paddingY={{ base: "3em", lg: "0em" }}>
          {status.message && (
            <StatusMessage message={status.message} type={status.type} onClose={() => setStatus({ message: "", type: "" })} />
          )}
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
      <Container maxW={{ base: "90%", lg: "1300px" }}>
        <Box
          // pos={{ base: "relative", lg: "absolute" }}
          width="100%"
          bgColor={"white"}
          boxShadow="xl"
          borderRadius="md"
          padding={5}
          paddingBottom={"50px"}
          // top="80%"
          // left="50%"
          // transform="translateX(-50%)"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.100"
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={5} w="100%">
            {filteredEvents.map((event) => (
              <EventItem key={event.id} event={event} categories={categories} />
            ))}
          </SimpleGrid>
        </Box>
      </Container>

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
