import { Button, DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@chakra-ui/react'
import React from 'react'

interface DialogProps {
    title: string;
    body: string;
    onClick: () => void;
}
const Dialog: React.FC<DialogProps> = ({ title, body }) => {
    return (
        <DialogRoot
            key={title}
            placement={'center'}
            motionPreset={'slide-in-bottom'}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>{body}</p>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant={'outline'}
                        >Cancel</Button>
                    </DialogActionTrigger>
                    <Button>Save</Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default Dialog