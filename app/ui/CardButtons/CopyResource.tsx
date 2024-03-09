'use Client'
import {Dropdown, MenuProps, Spin} from "antd";
import {FolderOpenFilled} from "@ant-design/icons";
import {ResourceCard} from "@/app/ui/ResourceCard";
import {useCallback, useMemo, useState} from "react";
import copyResource from "@/server-actions/y-resource-actionce/copyResource";
import {ErrorState} from "@/server-actions/types";
import {useFormState} from "react-dom";
import createFolder from "@/server-actions/y-resource-actionce/createFolder";
import checkOperationStatus from "@/server-actions/y-resource-actionce/checkOperationStatus";

export default function CopyResource({path,type,allInfo}:ResourceCard|{allInfo:Array<ResourceCard>}){
    const initialState:ErrorState = { description: '', error: '',status:0 ,message:''};
    // @ts-ignore: Type error.
    let [state,dispatch] = useFormState(copyResource,initialState)
    let [copPath,setCopyPath] = useState(null)

    const items: { icon: JSX.Element; label: string; key: string }[] = useMemo(()=>{
            return  allInfo.filter(item=>item.type==='dir')
                .map((item)=>{
                    return {icon:<FolderOpenFilled/> , label:item.path,key:item.path}
                } )
        },[])

    const handleMenuClick: MenuProps['onClick'] = useCallback((e) => {
        setCopyPath(e.key)
    },[]) ;
    const menuProps:MenuProps = useMemo(()=>{
        return  {
            items,
            onClick: handleMenuClick,
        }
    },[]);

    if(state?.status === 202){
        checkOperationStatus(state.description)
            .then((res)=>{
                console.log(res)
            })
    }


    function copyButtonClick(e){
        if(copPath){
            dispatch({
                from:path,
                to:copPath+'/'+path.split('/').at(-1)
            })
        }
    }

    return<div>
        {!!(state?.status & state.status > 0) && <p>  {state.status}</p>}
        {state?.message && <p style={{color:'red'}} title={state.message}>error {state.status}</p>}
        <Dropdown.Button menu={menuProps}  onClick={copyButtonClick}>
            { copPath === null ? 'set copy path':'click for copy'}
        </Dropdown.Button>
    </div>

}