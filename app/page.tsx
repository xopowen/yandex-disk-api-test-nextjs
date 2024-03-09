import Image from "next/image";
import YandexDiskApi from "@/services/YandexDiskApi";
import {YDiskError, YDiskInfo} from "@/services/typesYDisk";

export default async function  Home() {
  let yandexDisk =    new YandexDiskApi(process.env.yndexOauth)
  let diskInfo:YDiskInfo;
  let error:YDiskError;
  await yandexDisk.infoDisk().then((data)=>{
    if(data){
      diskInfo = data
    }
  }).catch((dError:YDiskError)=>{
    error = dError
  })

  return (<code className="p-24">{JSON.stringify(diskInfo)}</code>);
}
