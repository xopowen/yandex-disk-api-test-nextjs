'use server'
import YandexDiskApi from "@/services/YandexDiskApi";


export default async function Page(){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    const result = await yDisk.listAllFile()


    return <code>{JSON.stringify(result)}</code>
}