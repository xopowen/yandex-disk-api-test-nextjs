'use server'
import YandexDiskApi from "@/services/YandexDiskApi";
import {Resource, YDiskError} from "@/services/typesYDisk";

export default async function getResourceInfo(path: string):Promise<Resource|YDiskError|undefined>{
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    return await yDisk.infoResource(path)
        .then((data)=>{
            if(data){
                return data
            }
            return
        }).catch((error)=>{
         return error
    })
}