import { Wallet } from '@/pages/MainPage';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import React from 'react'
import { MdDeleteSweep } from 'react-icons/md';
import { PasswordInput } from '../ui/password-input';
import { toaster } from '../ui/toaster';

interface WalletCardProps {
    wallet: Wallet;
    index: number;
    handleDeleteWallet: (index: number) => void;
};

const WalletCard: React.FC<WalletCardProps> = ({ wallet, index, handleDeleteWallet }) => {
    const truncateString = (input: string, maxLength: number): string => {
        return input.length > maxLength ? `${input.slice(0, maxLength)}...` : input;
    };

    const handleCopyToClipboard = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log(textToCopy);
            toaster.create({
                description: "Copy to clipboard",
                type: "info"
            });
        }).catch((err) => {
            console.error('Failed to copy text: ', err);
            toaster.create({
                description: `Failed to copy text: ${err.message}`,
                type: "error"
            });
        });
    };

    const walletIndex = wallet.path.split("/").pop()?.replace("'", "") || "";
    const truncatedPublicKey = truncateString(wallet.publicKey, 36);

    return (
        <Box
            bg={'transparent'}
            w={'400px'}
            h={'fit-content'}
            maxW={'400px'}
            maxH={'300px'}
            border={'1px solid black'}
            _dark={{ border: '1px solid gray' }}
            borderRadius={8}
            key={index}
        >
            <Flex
                justify={'space-between'}
                align={'center'}
                paddingInline={4}
                paddingBlock={6}
            >
                <Text
                    color={{ base: 'white', _dark: 'black' }}
                    fontSize={'24px'}
                >
                    Wallet {parseInt(walletIndex) + 1}
                </Text>
                <IconButton size={'xl'} color={'secondary'}>
                    <MdDeleteSweep cursor={'pointer'} onClick={() => handleDeleteWallet(index)} />
                </IconButton>
            </Flex>
            <Box
                bg={'blackAlpha.700'}
                _dark={{ bg: 'white' }}
                w={'full'}
                marginBlockStart={4}
                paddingBlock={4}
                paddingInline={4}
                borderRadius={8}
                color={{ base: 'white', _dark: 'blackAlpha.700' }}
            >
                <Text fontSize={'20px'} marginBlockEnd={1}>Public Key</Text>
                <p style={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => handleCopyToClipboard(truncatedPublicKey)}>{truncatedPublicKey}</p>
                <Text
                    fontSize={'20px'}
                    marginBlockStart={4}
                    marginBlockEnd={1}
                >
                    Private Key
                </Text>
                <PasswordInput readOnly value={wallet.privateKey} paddingInline={2} onClick={() => handleCopyToClipboard(wallet.privateKey)} />
            </Box>
        </Box>
    )
}

export default WalletCard