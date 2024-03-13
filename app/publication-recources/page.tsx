'use server'
import YandexDiskApi from "@/services/YandexDiskApi";

export default async function page (){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)
    let data = await yDisk.listPublicated()

    return <code>{JSON.stringify(data)}</code>
}