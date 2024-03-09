'use server'
import YandexDiskApi from "@/services/YandexDiskApi";
import {revalidatePath} from "next/cache";
import ROUTERS from "@/app/constans";
import {redirect} from "next/navigation";


export default async function checkOperationStatus (hrefOperation,timeOut=300){
        let yDisk = new YandexDiskApi(process.env.yndexOauth)
    return await new Promise((resolve => {
        setTimeout(async () => {
            return await yDisk.statusAsyncOperation(hrefOperation)
                .then((status) => {
                    if(status?.status ==='success'){
                        revalidatePath(ROUTERS.appFolder)
                        redirect(ROUTERS.appFolder)
                    }
                    resolve({description: status?.status, status: status?.statusCode})
                })
        }, timeOut)
    })) ;


}