import Image from 'next/image';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

const NFTPage = () => {
    const connectWithMetamask = useMetamask();
    const disconnectWithMetamask = useDisconnect();
    const address = useAddress();
    return (
        < div className='bg-black text-white min-h-screen p-5 md:p-10' >
            {/* Header */}
            < div >
                <div className='flex items-center justify-between border-b-4 border-b-white pb-4'>
                    <h1 className='font-normal text-xl'>The <span className='text-pink-600 underline underline-offset-2'>PAPAFAM</span> NFT Market Place</h1>
                    <button onClick={()=>address ? disconnectWithMetamask() : connectWithMetamask()} className='bg-violet-800 py-3 px-9 font-bold rounded-full'>
                        {address? 'logout' : 'login'}
                    </button>
                </div>
            </div >
            <div className='mb-10 items-top justify-between md:px-10 md:grid md:grid-cols-10'>
                {/* Left */}
                < div className='col-span-4 flex flex-col items-center mt-20' >
                    <div className='rounded-lg bg-gradient-to-r from-pink-600 to-violet-800 flex text-center p-2 bg-cyan-500'>
                        <Image src='/nft.png' alt='' width={200} height={250} />
                    </div>
                    <div className='mt-4 text-center'>
                        <h1 className='text-xl text-violet-800'>PAPAFAM Apes</h1>
                        <h1 className='text-xl max-w-md'>A collection of PAPAFAM Apes who live & breathe React!</h1>
                    </div>
                </div >
                {/* Right */}
                < div className='col-span-6 p-5 bg-nft-background shadow-black mt-20 text-center space-y-10 md:text-left flex flex-col items-left justify-between pt-20 pb-20' >
                    <h1 className='text-5xl font-bold'>Welcome !!</h1>
                    <h1 className='text-violet-800 font-bold text-2xl'>To The PAPAFAM Ape Coding Club | NFT Drop</h1>
                    <h1 className='text-pink-600 text-xl'>13 / 21 NFT's claimed</h1>
                </div >

            </div>
            <div>
                <button className='w-full bg-violet-800 font-bold p-4 rounded-full'>
                    Mint NFT (0.01 ETH)
                </button>
            </div>
        </div >
    );
}

export default NFTPage

