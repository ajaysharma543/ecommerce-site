import { Client, Databases, Storage,Query, ID,} from "appwrite";
import conf from "../conf/conf";

class Service {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)  
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async getitemPost(id){
    try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteitemcollection,
            id
        )
    } catch (error) {
        console.log("Appwrite serive :: getPost :: error", error);
        return false
    }
}

async getPost(id){
  try {
      return await this.databases.getDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          id
      
      )
  } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false
  }
}

async getPosts(queries = []) {
  try {
      return await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          queries,
      );
  } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
  }
}


async getitemPosts(queries = []) {
  try {
      return await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteitemcollection,
          queries,
      );
  } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
  }
}

async getsubPosts(queries = []) {
  try {
      return await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwritesubcollection,
          queries,
      );
  } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
  }
}

async deletepost (id){
  try {
      await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteitemcollection,
          id,
      )
      return true;
  } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
  }
  return false;
}

async deletesubpost (id){
  try {
      await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwritesubcollection,
          id,
      )
      return true;
  } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
  }
  return false;
}

async getfiles(file) {
  if (!file) {
    console.warn("getfiles: No file provided, skipping upload.");
    return null;
  }

  try {
    const uploaded = await this.storage.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    );
    console.log("Uploaded File:", uploaded);
    return uploaded;
  } catch (error) {
    console.error("Appwrite service :: getfiles :: error", error);
    return null;
  }
}



async deleteFile(fileId) {
  if (!fileId) {
    console.error("deleteFile :: error :: No fileId provided");
    return false;
  }

  try {
    console.log("Attempting to delete file:", fileId);
    await this.storage.deleteFile(conf.appwriteBucketId, fileId);
    return true;
  } catch (error) {
    console.error("Appwrite service :: deleteFile :: error", error.message);
    return false;
  }
}



  getFilePreview(fileId) {
    return this.storage.getFilePreview(conf.appwriteBucketId, fileId).href;
  }

 async createCategory(category, description, file) {
  try {
    const uploaded = await this.getfiles(file);
    if (!uploaded) throw new Error("File upload failed");

    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      {
        category: category,
        description: description,
        images: uploaded.$id, 
      }
    );
  } catch (error) {
    console.error("Appwrite service :: createCategory :: error", error);
    throw error;
  }
}


 async createSubCategory(category, subcategory, description, file) {
  try {
    const uploadedFile = await this.getfiles(file);

    const newDocument = await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritesubcollection,
      ID.unique(),
      {
        category: category,
        subcategory: subcategory,
        description: description,
        images: uploadedFile.$id,
      }
    );

    return newDocument;
  } catch (error) {
    console.error("Appwrite Service :: createSubCategory :: Error:", error);
    throw error;
  }
}

 async createcartCategory(userid, itemid, title, description, price, category, subcategory, discount, imageId, quantity) {
  try {
    const newDocument = await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritecartcollection,
      ID.unique(),
      {
        userid: userid,
        itemid: itemid,
        title: title,
        description: description,
        price: price,
        category: category,
        subcategory: subcategory,
        discount: discount,
        images: imageId, 
        quantity: quantity,
      }
    );

    return newDocument;
  } catch (error) {
    console.error("Appwrite Service :: createcartCategory :: Error:", error);
    throw error;
  }
}
async getcartPosts(userId) {
  try {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwritecartcollection, 
      [Query.equal("userid", userId)]
    );
  } catch (error) {
    console.log("Appwrite service :: getcartPosts :: error", error);
    return { documents: [] }; 
  }
}


  async createItem(itemtitle, category, images, quantity, price, description,discount ,subcategory) {
    try {
      const uploaded = await this.getfiles(images);
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteitemcollection,
        ID.unique(),
        {
          category: category,
          description: description,
          images: uploaded.$id,
          quantity: quantity,
          price: price,
          itemtitle: itemtitle,
          discount: discount,
          subcategory:subcategory,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createItem :: error", error);
      throw error;
    }
  }

   async createorderItem(userid, fullname, address, city, postalcode,country, paymentmethod,items ,totalprice) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteordercollection,
        ID.unique(),
        {
          userid: userid,
          fullname: fullname,
          address:address,
          city: city,
          postalcode: postalcode,
          country: country,
          paymentmethod: paymentmethod,
          items: items,
          totalprice:totalprice,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createItem :: error", error);
      throw error;
    }
  }

  async getorderdetails (userid){
  try {
    const response =  await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteordercollection,
         [Query.equal("userid" , userid)]
      )
      return response.documents.length > 0;
  } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
  }
  return false;
}

async getAllOrderAddresses(userId) {
  try {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
      [Query.equal("userid", userId)]
    );
  } catch (error) {
    console.error("getAllOrderAddresses :: error", error);
    return false;
  }
}

  async updateOrderAddress(orderId, updatedData){
  try {
    return await this.databases.updateDocument( 
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
       orderId, 
      {
         fullname: updatedData.fullname,
      address: updatedData.address,
      city: updatedData.city,
      country: updatedData.country,
      postalcode: updatedData.postalcode,
      paymentmethod: updatedData.paymentmethod,
      totalprice: updatedData.totalprice,
      }
      );
  } catch (err) {
    console.error("Failed to update order:", err);
    throw err;
  }
}


   async updatepost(id, title, description, quantity, price, discount, newImageFile, oldImageId) {
  try {
    const existingDoc = await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteitemcollection,
      id
    );

    if (!existingDoc) {
      console.error("updatepost :: error :: Document not found:", id);
      return false;
    }

    let imageId = oldImageId;
    if (newImageFile) {
      await this.deleteFile(oldImageId);
      const uploaded = await this.getfiles(newImageFile);
      if (!uploaded) throw new Error("Image upload failed");
      imageId = uploaded.$id;
    }

    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteitemcollection,
      id,
      {
        itemtitle: title,
        description: description,
        quantity: quantity,
        price: price,
        discount: discount,
        images: imageId,
      }
    );
  } catch (error) {
    console.error("Appwrite service :: updatepost :: error", error);
    return false;
  }
}


async updatesubpost(id, category, subcategory, description, file = null) {
  try {
    let updateData = {
      category,
      subcategory,
      description,
    };

    if (file) {
      const uploadedFile = await this.getfiles(file);
      updateData.images = uploadedFile.$id;
    }
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwritesubcollection,
      id,
      updateData
    );
  } catch (error) {
    console.log("Appwrite service :: updatesubpost :: error", error);
    return false;
  }
}
async getAddressByUserId(userId) {
  const res = await this.databases.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwriteordercollection,
    [
      Query.equal( "userid" , userId), 
      Query.orderDesc("$createdAt"), 
      Query.limit(1),              
    ]
  );
  return res.documents[0] || null; 
}


async updatecartpost(itemid , quantity ,price) {
   return this.databases.updateDocument(
    conf.appwriteDatabaseId,
    conf.appwritecartcollection, 
    itemid,
   {
     quantity :quantity,
     price : price
   }
  );
}

async getAllOrdersByUserId(userId) {
  try {
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
      [
        Query.equal("userid", userId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return res.documents;
  } catch (error) {
    console.error("Appwrite :: getAllOrdersByUserId :: error", error);
    return [];
  }
}

async getAllOrdersByUserIds(userId) {
  if (!userId) {
    console.error("getAllOrdersByUserId :: error :: userId is required");
    return [];
  }

  try {
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
      [
        Query.equal("userid", userId),
        Query.orderDesc("$createdAt"),
      ]
    );
    return res.documents;
  } catch (error) {
    console.error("Appwrite :: getAllOrdersByUserId :: error", error);
    return [];
  }
}


async getLatestOrderPerUniqueUser() {
  try {
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
      [Query.orderDesc("$createdAt")]
    );

    const uniqueUsers = [];
    const userIds = [];

    for (let order of res.documents) {
      if (!userIds.includes(order.userid)) {
        userIds.push(order.userid);
        uniqueUsers.push(order);
      }
    }
    return uniqueUsers;
  } catch (error) {
    console.error("Error getting unique user orders:", error);
    return [];
  }
}
async getAllOrdersSortedByDate() {
  try {
    const res = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteordercollection,
      [Query.orderDesc("$createdAt")]
    );
    return res.documents;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

async deleteCartpost (id){
  try {
      await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwritecartcollection,
          id,
      )
      return true;
  } catch (error) {
      console.log("Appwrite serive :: createPost :: error", error);
  }
  return false;
}
}

const service = new Service();
export default service;
