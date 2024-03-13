import {useCallback, useRef, useState} from "react";
import getResourceInfo from "@/server-actions/y-resource-actionce/getResourceInfo";
import {Button, Form, Input, Spin} from "antd";
import addMetaInfo from "@/server-actions/y-resource-actionce/addMetaInfo";
import {ErrorState} from "@/server-actions/types";
import {useFormState} from "react-dom";
import createFolder from "@/server-actions/y-resource-actionce/createFolder";
import {Resource} from "@/services/typesYDisk";

export default function AddMetaInfo({path, setInfo}:{path:string,setInfo:Function}) {
    let [actionStatus,setStatus] = useState(false)

    function onFormFinish(values: any) {
        values.path = path
        setStatus(true)
        addMetaInfo(values)
            .then( (data)=>{
            if(data){
                setInfo(data)
            }
            return
        }).catch((error)=>{

        })
            .finally(()=>{
                setStatus(false)
            })

    }

    return <Form onFinish={onFormFinish}
                 style={{background:"white",borderRadius:10,padding:10}}
                 layout={'inline'}
                 autoComplete={'off'}>
        <Form.Item label={'key'} name={'keyName'} required  rules={[{ required: true, message: 'Please input info' }]}>
            <Input variant='filled' />
        </Form.Item>
        <Form.Item label={'value'} name={'value'} required  rules={[{ required: true, message: 'Please input info' }]}>
            <Input variant='filled' />
        </Form.Item>
        <Form.Item>
            {actionStatus && <Spin/>}
            {!actionStatus && <Button type="default"  htmlType="submit"  >
                Submit
            </Button>}
        </Form.Item>
    </Form>
}