export interface Image{
    asset: {
        _ref:string
    }
}
export interface Creator{
    id:string,
    name:string,
    slug:{
        current:string
    }
}
export interface Collection{
    id:string,
    address:string,
    description:string,
    title:string
    mainImage:Image
    previewImage:Image,
    nftCollectionName:string,
    slug:{
        current:string,
    },
    creator:Creator,
    
}