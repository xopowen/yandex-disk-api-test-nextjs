'use server'
import YandexDiskApi from "@/services/YandexDiskApi";
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import ROUTERS from "@/app/constans";
import type {ErrorState} from "@/server-actions/types";



export default async function copyResource(prevState:ErrorState,info:{from:string,to:string}){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    let {from,to} = info
    return await yDisk.copyResource(from,to)
        .then(async (data)=>{
        if(data){
            if(data.status === 201){
                revalidatePath(ROUTERS.appFolder)
                redirect(ROUTERS.appFolder)
            }

            return {description: data.href,status:data.status }
        }
        })
        .catch((error:ErrorState)=>{
            return error
        })
}