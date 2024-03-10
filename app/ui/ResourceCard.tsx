'use client'
import {useState} from "react";
import delResource from "@/server-actions/y-resource-actionce/delResource";
import {Button, Flex, Dropdown, MenuProps} from "antd";
export type ResourceCard = {
    path:string,
    type:string

}
import { Spin } from 'antd';
import CopyResource from "@/app/ui/CardButtons/CopyResource";
import MoveRecource from "@/app/ui/CardButtons/MoveRecource";
import DownloadFile from "@/app/ui/CardButtons/DownloadFile";


export default function ResourceCard({path,type,allInfo}:ResourceCard|{allInfo:Array<ResourceCard>}){
    let [actionStatus,setStatus] = useState(false)

    if(actionStatus){
        return <Spin/>
    }


    return<div>
        <p>{path}</p>
        <Flex gap={"middle"} align={'center'} justify={'center'}>
            {type !=='dir' &&  <DownloadFile path={path} />}
            <Button type={"primary"} onClick={()=>{delResource(path) }}>
                del
            </Button>
            <CopyResource path={path} type={type} allInfo = {allInfo} />
            <MoveRecource path={path} type={type} allInfo = {allInfo}/>
        </Flex>
    </div>
}