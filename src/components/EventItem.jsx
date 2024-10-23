import { Box, Flex, Heading, Image, Tag, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export const EventItem = ({ event, categories }) => {


    const eventCategories = categories.filter(
        (category) => Array.isArray(event.categoryIds) && event.categoryIds.includes(category.id)
    );
    const formDateTime = (dateTime) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Set to true for 12-hour format
        };
        return new Date(dateTime).toLocaleString(undefined, options);
    }

    return (
        <Link to={`/event/${event.id}`} key={event.id}>
            <Box padding="1em" borderRadius="md" borderWidth="1px" borderColor="purple.100" bgColor="white" boxShadow="lg" _hover={{ transform: "scale(1.1)" }} transition="0.3s ease all">
                <Box w="100%" h={{ base: "8em", lg: "10em" }} overflow="hidden" borderRadius="md" mb={3}>
                    <Image src={event.image} w="100%" h="100%" objectFit="cover" />
                </Box>
                <Box>
                    <Heading fontSize={{ base: "1rem", lg: "1.4rem" }} color="blue.900">{event.title}</Heading>
                    <Text mb={2} fontSize="1rem">{event.description}</Text>
                    <Box mb={2}>
                        <Text color={"gray.500"}><strong>Start:</strong> {formDateTime(event.startTime)}</Text>
                        <Text color={"gray.500"}><strong>End:</strong> {formDateTime(event.endTime)}</Text>
                    </Box>
                    <Flex gap={3}>
                        {eventCategories.map((category) => (
                            <Tag key={`${category.id}-${event.id}`} bgColor="#f1e8ff" color="#813ede" padding={2}>
                                {category.name}
                            </Tag>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </Link>
    )
}