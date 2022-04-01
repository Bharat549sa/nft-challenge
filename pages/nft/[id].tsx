import Image from 'next/image';
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { useRouter } from 'next/router';
import { Collection } from '../../typings';

interface Props{
    collection:Collection,
}

const NFTPage = ({collection} : Props) => {
    const connectWithMetamask = useMetamask();
    const disconnectWithMetamask = useDisconnect();
    const address = useAddress();
    return (
        < div className='min-h-screen flex flex-col justify-between' >
            {/* Header */}
            < header className='text-white  bg-[#03071E] w-full p-4 flex justify-between items-center'>
                <h1 className='md:text-xl'>The <span className='underline underline-offset-1 font-bold'>PAPAFAM</span> NFT Market Place</h1>
                <button onClick={() => address ? disconnectWithMetamask() : connectWithMetamask()} className='cursor-pointer text-black font-bold px-4 py-1 rounded-full bg-white'>{address ? "logout" : "login"}</button>
            </header >
            <div className='p-8 space-y-10 md:flex md:mx-auto md:space-x-20'>
                {/* Left */}
                < div className='flex ' >
                    <div className=' rounded-3xl p-2 flex items-center justify-center mx-auto bg-[#03071E] md:relative md:before:h-full md:before:w-full md:before:bg-[#9D0208] md:before:absolute md:before:rounded-xl md:before:-z-10 md:before:rotate-12'>
                        <img
                            src={urlFor(collection.previewImage.asset).url()}
                            alt=''
                            className='rounded-2xl md:w-64 h-80'
                        />
                    </div>
                </div >
                {/* Right */}
                < div className='text-center text-black space-y-10 md:max-w-2xl'>
                    <h1 className='font-bold text-2xl md:text-3xl lg:text-5xl'>Welcome To <span className='text-[#9D0208]'>The PAPAFAM</span> Ape Coding Club | NFT Drop</h1>
                    <h1 className='text-[#F48C06] md:text-xl lg:text-2xl'>{"13 / 21 NFT's claimed"}</h1>
                </div >

            </div>
            <div className='m-4 bg-[#03071E] p-3 rounded-lg space-y-4 md:flex justify-between items-center'>
                <div className='flex space-x-5'>
                    <img
                        src={urlFor(collection.previewImage.asset).url()}
                        alt=''
                        width={60}
                        height={60}
                    />
                    <div className='flex flex-col justify-center'>
                        <p className='text-xs'>{collection.description}</p>
                        <h1 className='font-bold'>{collection.title}</h1>
                    </div>
                </div>
                <button style={{margin: "auto 0"}} className='cursor-pointer bg-white text-black font-bold w-full py-2 md:w-1/2'>
                    Mint NFT (0.01 ETH)
                </button>
            </div>
        </div>

    );
}

export default NFTPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        address,
        description,
        mainImage{
          asset,
        },
        previewImage{
          asset,
        },
        slug{
          current,
        },
        title,
        nftCollectionName,
        creator->{
          _id,
          name,
          slug{
            current,
          },
        }
      }`;

    const collection = await sanityClient.fetch(query, {
        id: params?.id,
    });
    if (!collection) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            collection: collection
        }
    }
}