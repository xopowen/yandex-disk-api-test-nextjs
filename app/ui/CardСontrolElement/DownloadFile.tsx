'use client'
import {Button, Spin} from "antd";
import downloadFile from "@/server-actions/y-resource-actionce/downloadFile";
import {useCallback, useMemo, useState} from "react";

function fetchDownload(url, fileName){
    let a = document.createElement("a");
    console.log(url)
    a.href = url;
    a.setAttribute("download", fileName);
    document.body.append(a)
    a.click();
    let timeDel = setTimeout(()=>{
        a.remove()
        clearInterval(timeDel)
    },3000)
    return false;
}

export default function DownloadFile({path}:{path:string}){
    let [link,setLink] = useState('')
    let timeLifeLink = useMemo(()=>{
        if(link){
            return setTimeout(()=>{setLink('')},100*60*30)
        }
        return
    },[link])
    let [actionStatus,setStatus] = useState(false)
    let callBack = useCallback(()=>{
        setStatus(true)
        if(!link){
            downloadFile(path)
                .then((fileLink)=>{
                    if(fileLink?.href){
                        setLink(fileLink.href)
                        fetchDownload(fileLink.href,path.split('/').at(-1))
                    }
                })
                .finally(()=>{
                    setStatus(false)
                })
        }else{
            fetchDownload(link,path.split('/').at(-1))
            setStatus(false)
        }

    },[path,link])

    if(actionStatus){
        return <Spin/>
    }
    return <Button type={'primary'} onClick={callBack}>
        download
    </Button>
}