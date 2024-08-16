import DeleteButton from '@/components/Common/DeleteButton';
import { Button } from '@/components/Common/Button';
import { clerk } from '@/configs/clerk-server';
import { db } from '@/lib/db';
import { $compadres } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { CompadreTitleBar } from '@/components/Compadre/CompadreTitleBar';

type Props = {
    params: {
        compadreId: string
    }
};

const CompadrePage = async ({params: { compadreId }}: Props) => {
    const {userId} = await auth()
    
    if (!userId){
        return redirect('/dashboard');
    }

    const user = await clerk.users.getUser(userId);

    // passed to client components
    const serializedUser = user ? { // can add more properties needed to pass as needed
        id: user.id, 
        firstName: user.firstName,
        lastName: user.lastName,
      } : null; 

    const compadres = await db.select().from($compadres).where(
        and(
            eq($compadres.id, compadreId),
            eq($compadres.userId, userId)
    ))

    if (compadres.length != 1) {
        return redirect('/dashboard');
    }

    const compadre = compadres[0];

    return (
        <div className='min-h-screen grainy p-8'>
            <div className='max-w-6xl mx-auto'>
                <CompadreTitleBar compadre={compadre} user={serializedUser}/>

                <div className="h-4"></div>
                <div className='border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full'>
                    CONTENT HERE
                </div>
            </div>
        </div>
    )
}

export default CompadrePage;