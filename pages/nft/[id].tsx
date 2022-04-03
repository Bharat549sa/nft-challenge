import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import { useState, useEffect } from 'react';
import { LinearProgress } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
interface Props {
    collection: Collection,
}

const NFTPage = ({ collection }: Props) => {
    const [claimedSupply, setClaimedSuppy] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<number>(0);
    const [wantToClaimCount, setWantToClaimCount] = useState<number>(0);
    const [pricaInETH, setPriceInETH] = useState("0");
    const nftDrop = useNFTDrop(collection?.address);
    const [loading, setLoading] = useState(false);
    const connectWithMetamask = useMetamask();
    const disconnectWithMetamask = useDisconnect();
    const address = useAddress();
    useEffect(() => {
        if (!nftDrop) return;

        const fetchPrica = async () => {
            setLoading(true);
            const claimConditions = await nftDrop.claimConditions.getAll();
            setPriceInETH(claimConditions?.[0].currencyMetadata.displayValue);
        }
        fetchPrica().finally(() => setLoading(false));
    }, [nftDrop]);
    useEffect(() => {
        if (!nftDrop) return;

        const fetchNFTDropData = async () => {
            setLoading(true);
            const claimed = await nftDrop.getAllClaimed();
            const total = await nftDrop.totalSupply();
            setClaimedSuppy(claimed.length);
            setTotalSupply(total.toNumber());
        }
        fetchNFTDropData().finally(() => setLoading(false));
    }, [nftDrop]);

    const mintNFT = () => {
        if (!nftDrop || !address || wantToClaimCount == 0) return;
        setLoading(true);
        const notification = toast.loading('Minting ...', {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        nftDrop.claimTo(address, wantToClaimCount).then(async (tx) => {
            toast.success('Successfully Minted !!', {
                duration: 8000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: 'green',
                },
            })
        }).catch(()=>{
            toast.error("Somthing went wrong !!",{
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: 'red',
                },
            })
        }).finally(() => {
            setLoading(false);
            toast.dismiss(notification);
        });
    }
    return (
        < div className='min-h-screen flex flex-col justify-between' >
            <Toaster position="bottom-center" />

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
                    {loading ? (
                        <h1 className='text-orange-500 md:text-xl lg:text-2xl animate-pulse'>Lodding Supplay Count ...</h1>

                    ) : (
                        <h1 className='text-orange-500 md:text-xl lg:text-2xl'>{`${claimedSupply} / ${totalSupply} NFT's claimed`}</h1>

                    )}

                    {loading && (
                        <LinearProgress color="warning" />
                    )}
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
                <div className="flex items-center justify-between md:w-1/2">
                    <input className="text-black w-1/4 p-2" type="number" id="wantToClaimCount" onChange={() => setWantToClaimCount(Number((document?.getElementById('wantToClaimCount') as HTMLInputElement).value))} placeholder="claims count" min={1} max={totalSupply - claimedSupply} />
                    <button onClick={mintNFT} disabled={loading || totalSupply === claimedSupply || !address || wantToClaimCount < 1} style={{ margin: "auto 0" }} className='cursor-pointer bg-white text-black font-bold w-2/3 py-2 disabled:bg-gray-400'>
                        {loading ? (<>Loading ... </>) :
                            claimedSupply === totalSupply ?
                                (<>SOLD OUT</>)
                                :
                                (<>Mint NFT ({Number(pricaInETH) * wantToClaimCount} ETH)</>)}
                    </button>
                </div>
            </div>
        </div >

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