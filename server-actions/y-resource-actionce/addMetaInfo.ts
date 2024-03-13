'use server'
import YandexDiskApi from "@/services/YandexDiskApi";
import {Resource, YDiskError} from "@/services/typesYDisk";

export default async function addMetaInfo(initData):Promise<Resource|YDiskError|undefined>{
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    let metaInfo = {}

    metaInfo[initData.keyName] = initData.value
    return await yDisk.addMetaInfo(initData.path,metaInfo )
        .then((data)=>{
            if(data){
                return data
            }
            return
        })
        .catch((error:YDiskError)=>{
            return error
        })
}