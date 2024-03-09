'use server';
import {YDiskError} from "@/services/typesYDisk";
import YandexDiskApi from "@/services/YandexDiskApi";
import {revalidatePath} from "next/cache";
import ROUTERS from '@/app/constans'
import type {ErrorState} from "@/server-actions/types";


export default async function haveLoadFile(prevState:ErrorState,formData:FormData){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    // @ts-ignore: Type error.
    let file:File = formData.get('file1')
    console.log(file.name)

    return await yDisk.getLoadingLink(file.name)
        .then(async (link)=>{

         if(link){
           return  await  yDisk.loadToDisk(link.href,formData)
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