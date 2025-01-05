import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                primary: { value: '#EEDF7A' },
                secondary: { value: '#C7253E'},
                black: { value: '#1B1833' },
            },
        }
    },
});
export const system = createSystem(defaultConfig, config);