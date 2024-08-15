import CreateCompadre from '@/components/Common/CreateCompadre';
import { Button } from '@/components/Common/Button';
import { Separator } from '@/components/Common/Separator';
import { db } from '@/lib/db';
import { $compadres } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {}

const DashboardPage = async (props: Props) => {
    const {userId} = auth()
    const compadres = await db.select().from($compadres).where(
        eq($compadres.userId, userId!)
    )
    let subbed = false;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/checkSubscription?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        const { isSubscribed } = JSON.parse(responseText);
        subbed = isSubscribed;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle the error appropriately, maybe set a default value for subbed
        subbed = false;
    }

  return (
    <>
        <div className='grainy min-h-screen'>
            <div className='max-w-7xl mx-auto p-10'>
                <div className='h-14'>
                    <div className='flex justify-between items-center md:flex-row flex-col'>
                        <div className='flex items-center'>
                            <Link href="/">
                                <Button className='bg-green-600 rounded-xl' size="sm"><ArrowLeft className='mr-1 w-4 h-4'/>Back</Button>
                            </Link>

                            <div className='w-4'></div>
                            <h1 className='text-3xl font-bold text-white'>My Compadres</h1>
                            <div className='w-4'></div>
                            <UserButton />
                        </div>
                    </div>

                    <div className="h-8"></div>

                    <Separator />
                    
                    <div className="h-8"></div>
                    {/* <!-- conditional rendering --> */}
                    {compadres.length === 0 && (
                        <div className='text-center'>
                            <h2 className='text-xl text-gray-500'>You don&apos;t have any Compadres yet!</h2>
                        </div>
                    )}
                    

                    <div className='grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3'>
                      {compadres.length === 1 && !subbed && (
                          <CreateCompadre />
                      )}
                        {compadres.map(compadre => {
                            return (
                                <a href={`/compadre/${compadre.id}`} key={compadre.id}>
                                    <div className='border border-stone-200 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1'>
                                        {/* <img 
                                            width={400}
                                            height={200}
                                            alt={compadre.name}
                                            src={compadre.imageUrl || ""}
                                        /> */}
                                    <div className='p-4'>
                                        <h3 className='text-xl font-semibold text-white'>{compadre.name}</h3>
                                        <div className='h-1'></div>
                                        <p className='text-sm text-gray-500'>
                                            {new Date(compadre.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    </div>
                                    
                                </a>
                            )
                        })}
                    </div>
                    {compadres.length === 1 && !subbed && (
                    <div className='mt-8 p-4 bg-yellow-100 rounded-lg'>
                        <p className='text-yellow-800'>You&apos;ve created your first Compadre! Subscribe to create more.</p>
                        <Link href="/subscription">
                            <Button className="mt-2 bg-yellow-500 text-white">Subscribe Now</Button>
                        </Link>
                    </div>
                    )}
                </div>
            </div>
        </div>
    </>
    
  )
}

export default DashboardPage;