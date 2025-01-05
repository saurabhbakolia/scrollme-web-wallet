import { Box, Center, Text } from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box
            paddingBlockStart={3}
            bg={{ base: 'blackAlpha.900', _dark: 'white'}}
            color={{ base: 'white', _dark: 'black'}}
            paddingBlock={4}
            mt={'auto'}
        >
            <Center>
                <Text fontSize={'md'}>
                    Crafted with precision by <strong>Saurabh</strong> | Powered by ScrollMe Wallet
                </Text>
            </Center>
        </Box>
    )
}

export default Footer