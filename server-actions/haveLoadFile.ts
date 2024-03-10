'use server';
import {YDiskError} from "@/services/typesYDisk";
import YandexDiskApi from "@/services/YandexDiskApi";
import {revalidatePath} from "next/cache";
import ROUTERS from '@/app/constans'
import type {ErrorState} from "@/server-actions/types";



export default async function haveLoadFile(prevState:ErrorState,formData:FormData){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    // @ts-ignore: Type error.
    let file = formData.get('file')
    let nameFile = formData.get('nameFile')
    return await yDisk.getLoadingLink(nameFile )
        .then(async (link)=>{
         if(link?.href){
           return  await  yDisk.loadToDisk(link.href,file)
                 .then((statusResponse)=>{
                     if(statusResponse){
                         revalidatePath(ROUTERS.appFolder)
                         return {description: '', error: '',status:statusResponse.status}
                     }
                 }).catch((error:YDiskError)=>{
                   return error
               })
         }
    })
        .catch(error=>{
            return error
        })


}