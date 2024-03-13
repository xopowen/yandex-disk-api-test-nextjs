'use client'
import {Button, Spin, Alert, Space} from "antd";
import {useCallback, useState} from "react";
import publicationRecource from "@/server-actions/y-resource-actionce/publicationRecource";
import {Resource, YDiskError} from "@/services/typesYDisk";
import unPublicationRecource from "@/server-actions/y-resource-actionce/unPublicationRecource";
import {useFormState} from "react-dom";
 import {ErrorBoundaryHandler} from "next/dist/client/components/error-boundary";
import {ErrorComponent} from "@/app/info-app-folder/error";
let initError = {
    "description": '',
    "error": '',
    "message":''
}
export default function ControlPublicationResource({info}:{info: Resource}){

    let [loading,setLoading] = useState(false)
    let [error,setError] = useState<YDiskError>(initError)
    let [statusPublication,setStatusPub] = useState(info.hasOwnProperty('public_key'))
    let callBack = useCallback(()=>{
        setLoading(true)
        let fun;
        if(statusPublication){
            fun = unPublicationRecource
        }else{
            fun = publicationRecource
        }
        if(!loading){
            fun(info.path)
                .then((data)=>{
                    if(data?.error){
                        setError(data)
                    }
                    if(data?.status===200){
                        setStatusPub(()=>!statusPublication)
                    }
                })
                .finally(()=>{
                    setLoading(false)
                })
        }

    },[info.path,statusPublication])

    if(loading){
        return <Spin/>
    }

    function onClose() {
        setError(initError)
    }
    return  <>
        {error.error &&  <ErrorComponent error={error} onClose = {onClose}/>}
        <Button type={'primary'} onClick={callBack} >
            {!statusPublication && 'Publication' }
            {statusPublication && 'unpublication' }
        </Button>
    </>


}