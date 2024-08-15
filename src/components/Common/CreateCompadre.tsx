"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Common/Dialog'
import { Loader2, Plus } from 'lucide-react'
import { Input } from '@/components/Common/Input'   
import { Button } from '@/components/Common/Button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Props = {}

const CreateCompadre = (props: Props) => {
    const router = useRouter()
    const [input, setInput] = React.useState('');
    const [isSubscribed, setIsSubscribed] = React.useState(false);
    const [compadreCount, setCompadreCount] = React.useState(0);

    React.useEffect(() => {
        const checkSubscription = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/checkSubscription`);
            const data = await res.json();
            setIsSubscribed(data.isSubscribed);
            setCompadreCount(data.compadreCount);
        };
        checkSubscription();
    }, []);

    const createCompadre = useMutation({
        mutationFn: async () => {
            if (compadreCount >= 1 && !isSubscribed) {
                router.push('/subscription');
                return;
            }
            const response = await axios.post('/api/createCompadre', {
                name: input
            })
            return response.data
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input == ''){
            window.alert('Please enter a name for your Compadre.')
            return
        }

        createCompadre.mutate(undefined, {
            onSuccess: ({compadre_id}) => {
                console.log("Compadre Created", { compadre_id })
                // uploadToFirebase.mutate(compadre_id)
                router.push(`/compadre/${compadre_id}`)
            },
            onError: error => {
                console.error(error)
                window.alert("Failed to create new Compadre")
            },
        })
    };

  return (
    <Dialog>
        <DialogTrigger>
            <div className='border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover: shadow-xl transition hover:-translate-y-1 flex-row p-4'>
                <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
                <h2 className='font-semibold text-green-600 sm:mt-2'>New Compadre</h2>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    New Compadre
                </DialogTitle>

                <DialogDescription>
                    You can create a new compadre by clicking the button below. 
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <Input value={input} onChange={e => setInput(e.target.value)} placeholder='Name...' />
                <div className='h-4' />
                
                <div className='flex items-center gap-2'>
                    <Button type='reset' variant={"secondary"}>Cancel</Button>
                    <Button className='bg-green-600' type="submit" disabled={createCompadre.isPending}>
                        {createCompadre.isPending && ( <Loader2 className='w-4 h-4 mr-2 animate-spin'></Loader2>
                        )}Create</Button>
                </div>
            
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCompadre