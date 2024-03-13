'use client'
import {useState} from "react";
import delResource from "@/server-actions/y-resource-actionce/delResource";
import {Button, Flex,  Space} from "antd";
export type ResourceCard = {
    path:string,
    type:string

}
import { Spin } from 'antd';
import CopyResource from "@/app/ui/CardСontrolElement/CopyResource";
import MoveRecource from "@/app/ui/CardСontrolElement/MoveRecource";
import DownloadFile from "@/app/ui/CardСontrolElement/DownloadFile";
import GetResourceInfo from "@/app/ui/CardСontrolElement/GetResourceInfo";
import AddMetaInfo from "@/app/ui/CardСontrolElement/AddMetaInfo";
import PublicationResource from "@/app/ui/CardСontrolElement/PublicationResource";
import ControlPublicationResource from "@/app/ui/CardСontrolElement/ControlPublicationResource";


export default function ResourceCard({path,type,allInfo}: { path:string,type:string,allInfo }){
    let [actionStatus,setStatus] = useState(false)
    let [info , setInfo] = useState({})
    if(actionStatus){
        return <Spin/>
    }

    function haveResourceInfo(value){
        setInfo(value)
    }

    return<Space size='middle' direction={'vertical'} style={{position:'relative'}} >
        <p>{path}</p>
        <code>{JSON.stringify(info)}</code>

        <Flex gap={"middle"} align={'center'} justify={'center'}>
            <AddMetaInfo path={path} setInfo={haveResourceInfo}/>
        </Flex>
        <Flex gap={"middle"} align={'center'} justify={'center'}>
            {type !=='dir' &&  <DownloadFile path={path} />}
            <Button type={"primary"} onClick={()=>{delResource(path) }}>
                del
            </Button>
            <CopyResource path={path} type={type} allInfo = {allInfo} />
            <MoveRecource path={path} type={type} allInfo = {allInfo}/>
            <GetResourceInfo path={path} setInfo={haveResourceInfo}/>
            <ControlPublicationResource info={allInfo.find((item)=>item.path===path)}/>
        </Flex>
    </Space>
}