import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Flex, List, ListItem, Text } from '@chakra-ui/react';

export const Navigation = () => {
  return (
    // <nav>
    //   <ul>
    //     <li>
    //       <Link to="/">Events</Link>
    //     </li>
    //     <li>
    //       <Link to="/event/1">Event</Link>
    //     </li>
    //   </ul>
    // </nav>

    <Box w={"100%"} backgroundColor={"white"} boxShadow="sm" paddingY={{ base: "0.5em", lg: "1.2em" }} pos={"fixed"} zIndex={1000}>
      <Container maxW={{ base: "90%", lg: "1300px" }}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            fontWeight={"800"}
            fontSize={{ base: "1.2rem", lg: "1.4rem" }}
            bgGradient="linear(60deg, #813ede, #23ebc0)"
            bgClip="text"
          >
            Event planner
          </Text>
          <List display="flex" gap={2} alignItems="center">
            <ListItem color={"blue.900"}><Link>Events</Link></ListItem>
            <ListItem><Link>Event</Link></ListItem>
          </List>
        </Flex>
      </Container>
    </Box>
  );
};
