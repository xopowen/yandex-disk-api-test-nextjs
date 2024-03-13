'use server'
import YandexDiskApi from "@/services/YandexDiskApi";

export default async function unPublicationRecource(path){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)

    return await yDisk.unPublicationResource(path)
        .then((data)=>{
        if(data){
            return data
        }
    })
        .catch((error)=>{
            return error
        })
}