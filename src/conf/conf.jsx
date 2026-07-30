const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteitemcollection: String(import.meta.env.VITE_APPWRITE_ITEMCOLLECTION_ID),
    appwritesubcollection: String(import.meta.env.VITE_APPWRITE_SUBCOLLECTION_ID),
    appwriteusercollection: String(import.meta.env.VITE_APPWRITE_USERCOLLECTION_ID),
        appwriteordercollection: String(import.meta.env.VITE_APPWRITE_ORDERCOLLECTION_ID),
    appwritecartcollection: String(import.meta.env.VITE_APPWRITE_CARTCOLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),}
export default conf;

