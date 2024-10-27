import { Box, Button, Flex } from "@chakra-ui/react"

export const StatusMessage = ({ message, type, onClose }) => {
    const bgColor = type === "success" ? "green.100" : "red.100";
    const textColor = type === "success" ? "green.800" : "red.800";

    return (
        <Box
            bgColor={bgColor}
            color={textColor}
            p={4}
            borderRadius="md"
            position="relative"
            mb={4}
            w="400px"
        >
            <Flex alignItems="center" justifyContent="space-between">
                <span>{message}</span>
                <Button
                    size="xs"
                    onClick={onClose}
                    colorScheme={type === "success" ? "green" : "red"}
                >
                    Close
                </Button>
            </Flex>
        </Box>
    )
}