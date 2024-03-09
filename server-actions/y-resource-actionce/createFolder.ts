'use server'
import type {ErrorState} from "@/server-actions/types";
import YandexDiskApi from "@/services/YandexDiskApi";
import {revalidatePath} from 'next/cache'
import ROUTERS from "@/app/constans";

export default async function createFolder(prevState:ErrorState,formData:any){

    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    let folder = formData?.['folder-name']
    if(typeof folder === "string"){
          return  await yDisk.createFolder(folder)
                .then((dataResponse)=>{
                if(dataResponse){
                    revalidatePath(ROUTERS.appFolder)
                 return {description: dataResponse.href,status:dataResponse.status }
                }})
                .catch((error:ErrorState)=>{
                    return error
                })
    }





}