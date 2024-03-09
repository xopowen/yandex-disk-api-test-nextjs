import YandexDiskApi from "@/services/YandexDiskApi";
import {CustomError, ResourceFolder, YDiskError, YDiskInfo} from "@/services/typesYDisk";
import ResourceCard from "@/app/ui/ResourceCard";
import {Button, Flex} from "antd";
import delResource from "@/server-actions/y-resource-actionce/delResource";
import copyResource from "@/server-actions/y-resource-actionce/copyResource";

export default async function Page(){
    let yandexDisk:YandexDiskApi =  new YandexDiskApi(process.env.yndexOauth)
    let info:ResourceFolder | undefined;
    let error:YDiskError|CustomError|undefined;

    await yandexDisk.infoAppFolder()
        .then(folderInfo=>{
            info = folderInfo
        })
        .catch( async (yError:CustomError)=>{
            error=yError
        })
    if(error){
        return  <code className="p-24">{JSON.stringify(error)}</code>
    }

    return <div>
        <code className="p-24">{JSON.stringify(info)}</code>
        <div style={{marginBlock:"10px"}}>
            {info && info._embedded?.items && info._embedded.items.map((item,index)=>{
                return <ResourceCard key={item.path} path={item.path} type={item.type} allInfo = {info._embedded.items}/>
            })}
        </div>


    </div>
}