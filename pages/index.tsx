import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { sanityClient, urlFor } from '../sanity';
import { Collection } from '../typings';
import Link from 'next/link';

interface Props {
  collections: Collection[]
}
const Home = ({ collections }: Props) => {
  const renderCollections = () => {
    let html_collection = []
    collections.forEach((collection) => {
      html_collection.push(
        <Link href={`/nft/${collection.slug.current}`} passHref>
            <div key={collection.id} className='shadow-xl shadow-black cursor-pointer  rounded-xl w-72 h-screen/2 bg-[#03071E]  md:relative md:before:h-full md:before:w-full md:before:bg-[#9D0208] md:before:absolute md:before:rounded-xl md:before:-z-10 md:hover:before:rotate-12 md:hover:before:duration-100'>
              <div className='p-2'>
                <img className='rounded-t-xl' src={urlFor(collection.mainImage).url()} alt="" />
              </div>
              <div className='p-4 space-y-3'>
                <h1 className='text-xl font-bold'>{collection.title}</h1>
                <h1 className='text-[#F0F0F0]'>{collection.description}</h1>
              </div>
            </div>
        </Link>
      );
    });
    return html_collection;
  }
  return (
    <div className='min-h-screen p-8  bg-[#03071E]'>
      <h1 className='font-bold text-white md:text-2xl'>
        The <span className='bg-[#9D0208] p-2 rounded-md'>PAPAFAM</span> NFT Market Place
      </h1>
      <main className='mt-20'>
        <div className='space-y-9 max-w-7xl mx-auto px-10 py-8 bg-[#F0F0F0] grid md:grid-cols-2 md:relative md:z-50 lg:grid-cols-3 xl:grid-cols-4'>
          {renderCollections()}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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

  const collections = await sanityClient.fetch(query);
  return {
    props: {
      collections: collections
    }
  }
}