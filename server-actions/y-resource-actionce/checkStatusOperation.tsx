import YandexDiskApi from "@/services/YandexDiskApi";



export default async function checkStatusOperation(){
    let yDisk = new YandexDiskApi(process.env.yndexOauth)

    yDisk.statusAsyncOperation()
}