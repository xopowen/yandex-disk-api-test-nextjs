import {Button, Spin} from "antd";
import {useCallback, useState} from "react";
import getResourceInfo from "@/server-actions/y-resource-actionce/getResourceInfo";
import {Resource, YDiskError} from "@/services/typesYDisk";

export default function GetResourceInfo({path, setInfo}:{path:string,setInfo:Function}){
    let [actionStatus,setStatus] = useState(false)
    let callBack = useCallback(()=>{
        setStatus(true)
        getResourceInfo(path)
            .then((res:Resource|YDiskError|undefined) =>{
                if(res && res.hasOwnProperty('error')){
                    console.log(res)
                    return
                }
                if(res){
                    setInfo(res)
                }

        }) .finally(()=>{
            setStatus(false)
        })
    },[path])

    if(actionStatus){
        return <Spin/>
    }
    return <Button type={'primary'} onClick={callBack}>
        get info
    </Button>
}