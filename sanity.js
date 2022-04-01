import {createCurrentUserHook , createClient} from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url'

const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // you can find this in sanity.json
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // or the name you chose in step 1
    useCdn: true, // `false` if you want to ensure fresh data
    apiVersion: "2021-10-21"
  };
export const sanityClient =  createClient(config);

export const urlFor = (source)=> createImageUrlBuilder(config).image(source); 