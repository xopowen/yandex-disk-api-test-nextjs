'use server'
import YandexDiskApi from "@/services/YandexDiskApi";

export default async function publicationRecource(path){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)

    return await yDisk.toPublicationResource(path)
        .then((data)=>{
            if(data){
                return data
            }
        })
        .catch((error)=>{
            return error
        })

}