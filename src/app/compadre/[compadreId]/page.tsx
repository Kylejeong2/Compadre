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

    const user = clerk.users.getUser(userId);

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
        <div className='max-w-4xl mx-auto'>
            <div className='border shadow-xl border-stone-200 rounded-lg p-4 flex items-center'>
                <Link href="/dashboard" replace>
                    <Button className="bg-green-600" size="sm">
                        Back
                    </Button>
                </Link>
                <div className="w-3"></div>
                <span className='font-semibold'>
                    {(await user).firstName} {(await user).lastName}
                </span>
                <span className='inline-block mx-1'>/</span>
                <span className='text-stone-500 font-semibold'>
                    {compadre.name}
                </span>
                <div className="ml-auto">
                    <DeleteButton compadreId={compadre.id}/>
                </div>
            </div>

            <div className="h-4"></div>
            <div className='border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full'>
                CONTENT HERE
            </div>
            
        </div>
    </div>
  )
}

export default CompadrePage;