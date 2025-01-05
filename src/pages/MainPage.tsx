import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import NavBar from '@/components/wallet-ui/NavBar';
import { Box, Button, Center, Flex, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { PasswordInput } from '@/components/ui/password-input';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { ethers } from "ethers";
import { toaster } from "@/components/ui/toaster";
import WalletCard from '@/components/wallet-ui/WalletCard';
import Footer from '@/components/wallet-ui/Footer';
// import WalletCard from '@/components/wallet-ui/WalletCard';

export interface Wallet {
    publicKey: string;
    privateKey: string;
    mnemonic: string;
    path: string;
};


const MainPage = () => {
    const [isCreateWalletClicked, setIsCreateWalletClicked] = useState<boolean>(false);
    const [mnemonics, setMnemonics] = useState<string | null>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [pathType, setPathType] = useState<string | null>(null);
    const pathTypeNames: { [key: string]: string } = {
        "501": "Solana",
        "60": "Ethereum",
    };

    const pathTypeName = pathTypeNames[pathType || ""];

    useEffect(() => {
        const storedWallets = localStorage.getItem("wallets");
        const storedMnemonic = localStorage.getItem("mnemonics");
        const storedPathTypes = localStorage.getItem("paths");

        if (storedWallets && storedMnemonic && storedPathTypes) {
            setIsCreateWalletClicked(true);
            setWallets(JSON.parse(storedWallets));
            setMnemonics(JSON.parse(storedMnemonic));
            setPathType(JSON.parse(storedPathTypes));
        }
    }, []);

    const generateWalletFromMnemonic = (
        pathType: string,
        mnemonic: string,
        accountIndex: number
    ): Wallet | null => {
        console.log("Generating wallet");
        try {
            const seedBuffer = mnemonicToSeedSync(mnemonic);
            const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
            const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

            let publicKeyEncoded: string;
            let privateKeyEncoded: string;

            if (pathType === "501") {
                // Solana
                const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
                const keypair = Keypair.fromSecretKey(secretKey);

                privateKeyEncoded = bs58.encode(secretKey);
                publicKeyEncoded = keypair.publicKey.toBase58();
            } else if (pathType === "60") {
                // Ethereum
                const privateKey = Buffer.from(derivedSeed).toString("hex");
                privateKeyEncoded = privateKey;

                const wallet = new ethers.Wallet(privateKey);
                publicKeyEncoded = wallet.address;
            } else {
                toaster.create({
                    description: "Unsupported path type.",
                    type: "error",
                });
                return null;
            }

            return {
                publicKey: publicKeyEncoded,
                privateKey: privateKeyEncoded,
                mnemonic,
                path,
            };
        } catch (error) {
            toaster.create({
                description: `Failed to generate wallet. Please try again., ${error}`,
                type: "error",
            });
            return null;
        }
    };

    const generatePhrase = async () => {
        const mn = await generateMnemonic();
        setMnemonics(mn);
        localStorage.setItem("mnemonics", JSON.stringify(mn));
        generateWalletFromMnemonic(pathType || "", mnemonics ?? "", 0);
        toaster.create({
            description: "Secret phrase generated successfully.",
            type: "info",
        });
    };


    const handleClearWallets = () => {
        localStorage.removeItem("wallets");
        localStorage.removeItem("mnemonics");
        localStorage.removeItem("paths");
        setWallets([]);
        setMnemonics(null);
        setPathType(null);
        toaster.create({
            description: "All wallets have been cleared.",
            type: "success",
        });
    };

    const handleDeleteWallet = (index: number) => {
        console.log("index", index, wallets);
        const updatedWallets = wallets.filter((_, i) => i !== index);
        setWallets(updatedWallets);
        localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    };

    const handleAddWallet = () => {
        if (!mnemonics) {
            toaster.create({
                description: "No mnemonic found. Please generate a wallet first.",
                type: "error",
            });
            return;
        }

        const wallet = generateWalletFromMnemonic(
            pathType || "",
            mnemonics,
            wallets.length
        );
        if (wallet) {
            const updatedWallets = [...wallets, wallet];
            setWallets(updatedWallets);
            localStorage.setItem("wallets", JSON.stringify(updatedWallets));
            toaster.create({ description: "Wallet generated successfully!", type: "success" });
        }
    };
    return (
        <>
            <Box
                bg={'blackAlpha.900'}
                _dark={{ bg: '#FBFBFB' }}
                color={'whiteAlpha.950'}
                w={'fullScreen'}
                minH={'100vh'}
                paddingInline={20}
                paddingBlockStart={6}
            >
                <NavBar />
                {!isCreateWalletClicked && pathType == null ?
                    <Box
                        marginBlock={32}
                    >
                        <Heading size={'5xl'}>
                            <Center color={{ base: 'white', _dark: 'blackAlpha.800' }}>
                                One Seed Phrase, Infinite Possibilities,
                            </Center>
                            <Center as="span" color={'primary'}>Limitless Control.</Center>
                            <Center as={'p'} fontSize={'lg'} fontWeight={'400'} color={'gray.400'}>
                                Effortlessly manage Ethereum and Solana wallets in one secure place.
                            </Center>
                        </Heading>
                        <Center>
                            <Button
                                bg={'primary'}
                                color={'black'}
                                paddingBlock={2}
                                paddingInline={3}
                                onClick={() => setIsCreateWalletClicked(true)}
                            >
                                Create Wallet
                                <MdOutlineKeyboardArrowRight />
                            </Button>
                        </Center>
                    </Box>
                    :
                    pathType == null &&
                    <Box
                        marginBlock={10}
                    >
                        <Heading size={'4xl'} w={'70%'} marginBlock={2} fontWeight={500} color={{ base: 'white', _dark: 'blackAlpha.800' }}>Create and manage Ethereum and Solana wallets using a single seed phrase.</Heading>
                        <Text fontSize={'xl'} color={{ base: 'white', _dark: 'blackAlpha.600' }}>Choose Your Blockchain.</Text>
                        <HStack wrap={'wrap'} marginBlock={5} gap={4}>
                            <Button
                                bg={'primary'}
                                color={'black'}
                                paddingBlock={2}
                                paddingInline={3}
                                onClick={() => {
                                    setPathType("501");
                                    localStorage.setItem("paths", JSON.stringify("501"));
                                    toaster.create({
                                        description: "Blockchain selected successfully.",
                                        type: "success",
                                    });
                                }}
                            >
                                Solana
                            </Button>
                            <Button
                                bg={'primary'}
                                color={'black'}
                                paddingBlock={2}
                                paddingInline={3}
                                onClick={() => {
                                    setPathType("60");
                                    localStorage.setItem("paths", JSON.stringify("60"));
                                    toaster.create({
                                        description: "Wallet selected. Please generate a wallet to continue.",
                                        type: "success",
                                    });
                                }}
                            >
                                Ethereum
                            </Button>
                        </HStack>
                    </Box>
                }
                {pathType && mnemonics == null
                    &&
                    <Box
                        marginBlock={10}
                    >
                        <Heading size={'4xl'} color={{ base: 'white', _dark: 'blackAlpha.800' }}>Your secret recovery phrase</Heading>
                        <Heading size={'xl'} fontWeight={400} color={{ base: 'white', '_dark': 'blackAlpha.600' }}>Save these words in a safe place. They are the key to your wallet and funds.</Heading>
                        <Flex
                            justify={'space-between'}
                            align={'center'}
                            gap={6}
                            marginBlock={2}
                        >
                            <Input
                                marginBlock={2}
                                paddingInline={3}
                                placeholder='Enter your secret phrase (or leave blank to generate)'
                                border={'none'}
                            />
                            <Button
                                bg={'primary'}
                                color={'black'}
                                paddingBlock={2}
                                paddingInline={3}
                                onClick={generatePhrase}
                            >
                                Generate Secret Phrase
                            </Button>
                        </Flex>
                    </Box>
                }
                {mnemonics
                    &&
                    <>
                        <Box
                            marginBlock={4}
                        >
                            <Text color={{ base: 'white', _dark: 'blackAlpha.800' }}>Your Secret Phrase</Text>
                            <PasswordInput
                                readOnly={true}
                                value={mnemonics}
                                marginBlock={2}
                                paddingInline={3}
                                color={{ base: 'white', _dark: 'blackAlpha.700' }}
                            />
                        </Box>
                        <Box
                            marginBlock={6}
                        >
                            <Flex
                                justify={'space-between'}
                                align={'center'}
                                gap={4}
                            >
                                <Heading size={'3xl'} color={{ base: 'white', _dark: 'blackAlpha.800' }}>{pathTypeName} Wallet</Heading>
                                <HStack gap={2}>
                                    <Button
                                        bg={'primary'}
                                        color={'black'}
                                        paddingBlock={2}
                                        paddingInline={3}
                                        onClick={handleAddWallet}
                                    >
                                        Add Wallet
                                    </Button>
                                    <Button
                                        bg={'secondary'}
                                        paddingBlock={2}
                                        paddingInline={3}
                                        color={'white'}
                                        onClick={handleClearWallets}
                                    >
                                        Clear Wallet
                                    </Button>
                                </HStack>
                            </Flex>


                        </Box>
                        {/* Wallets */}
                        {wallets.length > 0 &&
                            <Flex
                                justify={'flex-start'}
                                align={'center'}
                                gap={4}
                                wrap={'wrap'}
                            >
                                {wallets.map((w, i) => {
                                    return <WalletCard wallet={w} index={i} handleDeleteWallet={handleDeleteWallet} />
                                })}
                            </Flex>
                        }
                    </>
                }
            </Box >
            <Footer />
        </>
    )
}

export default MainPage