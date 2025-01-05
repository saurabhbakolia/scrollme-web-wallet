import { Box, Flex, Heading } from '@chakra-ui/react'
import { FaGoogleWallet } from "react-icons/fa";
import { useState } from 'react';
import { ColorModeButton } from '../ui/color-mode';

const NavBar = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };
    return (
        <Flex
            justify={'space-between'}
            align={'center'}
            wrap={'wrap'}
            userSelect={'none'}
            _dark={{ color: "black" }}
        >
            <Flex gap={2}>
                <FaGoogleWallet size={'32px'} />
                <Heading
                    size={'2xl'}
                    fontWeight={'bold'}
                >
                    ScrollMe Wallet
                </Heading>
            </Flex>
            <Box p={2} onClick={toggleMode} cursor={'pointer'}>
                <ColorModeButton _dark={{ bg: 'black' }} bg={'primary'} />
            </Box>
        </Flex >
    )
}

export default NavBar