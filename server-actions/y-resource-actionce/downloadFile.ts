'use server'

import YandexDiskApi from "@/services/YandexDiskApi";

export default async function downloadFile(path:string){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)

    return await yDisk.getDownloadFileLink(path)

}
