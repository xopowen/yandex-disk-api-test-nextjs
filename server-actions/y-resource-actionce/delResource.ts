'use server'
import {redirect} from 'next/navigation';
import  {revalidatePath} from 'next/cache'
import YandexDiskApi from "../../services/YandexDiskApi";
import ROUTERS from "@/app/constans";

export default async function delResource(path:string){

    let yDisk = new YandexDiskApi(process.env.yndexOauth)

    return  yDisk.delFileOrFolder(path)
        .then((data)=>{
            console.log(data)
        if(data?.status === 204){
            revalidatePath(ROUTERS.appFolder)
            redirect('/info-app-folder')
        }
        if(data?.status === 202){

        }


    })


}